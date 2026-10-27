// @ts-nocheck
import { createServerOnlyFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import {
  allowedFields,
  mayManageCodes,
  mayDeleteTeam,
  boardRoles,
  removeDeletedTeams,
} from "./portal-policy";

const encode = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
const decode = (value: string) =>
  Uint8Array.from(atob(value.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
const hash = async (value: string) =>
  encode(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value))));
async function hmac(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return encode(
    new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value))),
  );
}
async function crypt(value: string, secret: string, decrypt = false) {
  const key = await crypto.subtle.importKey(
    "raw",
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret)),
    "AES-GCM",
    false,
    ["encrypt", "decrypt"],
  );
  if (decrypt) {
    const [iv, content] = value.split(".");
    if (!iv || !content) throw new Error("Invalid credential");
    return new TextDecoder().decode(
      await crypto.subtle.decrypt({ name: "AES-GCM", iv: decode(iv) }, key, decode(content)),
    );
  }
  const iv = crypto.getRandomValues(new Uint8Array(12));
  return (
    encode(iv) +
    "." +
    encode(
      new Uint8Array(
        await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(value)),
      ),
    )
  );
}
const result = (body: unknown, status = 200, cookie?: string) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...(cookie ? { "Set-Cookie": cookie } : {}) },
  });
const cookieFor = (request: Request, value: string, age: number) =>
  `league_portal=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${age}${new URL(request.url).protocol === "https:" ? "; Secure" : ""}`;
type Session = { role: string; id?: number; version: string; expires: number };

export const handlePortal = createServerOnlyFn(async (request: Request) => {
  const secret = process.env["LEAGUE_SESSION_SECRET"];
  const master = process.env["LEAGUE_SUPER_ADMIN_CODE"];
  const url = process.env["SUPABASE_URL"];
  const publicKey = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!secret || !master || !url || !publicKey)
    return result({ error: "Private sign-in setup is incomplete." }, 503);
  const publicDb = createClient(url, publicKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        headers.delete("Authorization");
        headers.set("apikey", publicKey);
        return fetch(input, { ...init, headers });
      },
    },
  });
  const action = new URL(request.url).searchParams.get("action") || "session";
  const origin = request.headers.get("Origin");
  if (request.method !== "GET" && origin !== new URL(request.url).origin)
    return result({ error: "Request rejected." }, 403);
  if (request.method === "GET" && action === "state") {
    const { data, error } = await publicDb
      .from("league_shared_state")
      .select("data,revision,deleted_team_ids")
      .eq("id", 1)
      .maybeSingle();
    return error
      ? result({ error: "League data unavailable." }, 503)
      : result(data || { data: null, revision: 0, deleted_team_ids: [] });
  }
  const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
  let session: Session | null = null;
  try {
    const token = request.headers.get("Cookie")?.match(/(?:^|;\s*)league_portal=([^;]+)/)?.[1];
    if (token) {
      const [payload, signature] = token.split(".");
      if (payload && signature && (await hmac(payload, secret)) === signature) {
        const parsed: Session = JSON.parse(new TextDecoder().decode(decode(payload)));
        if (parsed.expires > Date.now()) {
          if (parsed.role === "SUPER_ADMIN" && parsed.version === (await hash(master)))
            session = parsed;
          else if (parsed.id) {
            const { data: credential } = await db
              .from("portal_credentials")
              .select("active,code_hash")
              .eq("id", parsed.id)
              .maybeSingle();
            const { data: access } = await db
              .from("portal_access")
              .select("role_key")
              .eq("credential_id", parsed.id)
              .maybeSingle();
            if (
              credential?.active &&
              credential.code_hash === parsed.version &&
              access?.role_key === parsed.role
            )
              session = parsed;
          }
        }
      }
    }
  } catch {
    session = null;
  }
  if (request.method === "GET" && action === "session")
    return result({
      role: session?.role || null,
      accessClass: session
        ? session.role === "SUPER_ADMIN"
          ? "SUPER_ADMIN"
          : "BOARD_MEMBER"
        : "VIEWER",
    });
  let body: Record<string, unknown> = {};
  if (request.method !== "GET") {
    if (Number(request.headers.get("Content-Length") || 0) > 2500000)
      return result({ error: "Data too large." }, 413);
    try {
      body = await request.json();
    } catch {
      return result({ error: "Invalid request." }, 400);
    }
  }
  if (action === "logout") return result({ ok: true }, 200, cookieFor(request, "", 0));
  if (action === "login" && request.method === "POST") {
    const ip =
      request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "local";
    const keyHash = await hash(ip + secret);
    const { data: limit } = await db
      .from("portal_login_limits")
      .select("*")
      .eq("key_hash", keyHash)
      .maybeSingle();
    const recent = limit && Date.now() - Date.parse(limit.window_start) < 900000;
    if (recent && limit.attempts >= 10)
      return result({ error: "Too many attempts. Try again in 15 minutes." }, 429);
    const { error: limitError } = await db.from("portal_login_limits").upsert({
      key_hash: keyHash,
      attempts: recent ? limit.attempts + 1 : 1,
      window_start: recent ? limit.window_start : new Date().toISOString(),
    });
    if (limitError) return result({ error: "Sign-in temporarily unavailable." }, 503);
    const code = typeof body["code"] === "string" ? body["code"].trim() : "";
    if (!code || code.length > 200) return result({ error: "Invalid sign-in code." }, 401);
    const digest = await hash(code);
    let next: Session | null =
      digest === (await hash(master))
        ? { role: "SUPER_ADMIN", version: digest, expires: Date.now() + 28800000 }
        : null;
    if (!next) {
      const { data: credential } = await db
        .from("portal_credentials")
        .select("id,active")
        .eq("code_hash", digest)
        .maybeSingle();
      if (credential?.active) {
        const { data: access } = await db
          .from("portal_access")
          .select("role_key")
          .eq("credential_id", credential.id)
          .maybeSingle();
        if (access)
          next = {
            role: access.role_key,
            id: credential.id,
            version: digest,
            expires: Date.now() + 28800000,
          };
      }
    }
    if (!next) return result({ error: "Invalid or paused sign-in code." }, 401);
    await db.from("portal_login_limits").delete().eq("key_hash", keyHash);
    const payload = encode(new TextEncoder().encode(JSON.stringify(next)));
    return result(
      { role: next.role },
      200,
      cookieFor(request, payload + "." + (await hmac(payload, secret)), 28800),
    );
  }
  if (!session) return result({ error: "Sign in first." }, 401);
  if (action === "credentials") {
    if (!mayManageCodes(session.role))
      return result({ error: "Only Super Admin can manage board codes." }, 403);
    if (request.method === "POST") {
      if (body["operation"] === "delete") {
        const { error } = await db.from("portal_credentials").delete().eq("id", Number(body["id"]));
        return error
          ? result({ error: "Could not remove board access." }, 503)
          : result({ ok: true });
      }
      const profile = body["profile"];
      if (
        !profile ||
        !Number.isSafeInteger(profile.id) ||
        typeof profile.name !== "string" ||
        !profile.name.trim() ||
        !boardRoles.includes(profile.key)
      )
        return result({ error: "Select an existing board responsibility and enter a name." }, 400);
      const code = body["regenerate"]
        ? "MSL-" + encode(crypto.getRandomValues(new Uint8Array(18)))
        : typeof profile.code === "string"
          ? profile.code.trim()
          : "";
      if (code.length < 12 || code.length > 200)
        return result({ error: "Board codes must contain 12–200 characters." }, 400);
      const safeProfile = {
        id: profile.id,
        key: profile.key,
        name: profile.name.slice(0, 120),
        role: String(profile.role || "").slice(0, 120),
        email: String(profile.email || "").slice(0, 200),
        desc: String(profile.desc || "").slice(0, 2000),
        responsibilities: Array.isArray(profile.responsibilities)
          ? profile.responsibilities.slice(0, 10)
          : [],
        paused: Boolean(profile.paused),
      };
      const { error } = await db.from("portal_credentials").upsert({
        id: profile.id,
        code_hash: await hash(code),
        code_ciphertext: await crypt(code, secret),
        active: !safeProfile.paused,
      });
      if (error) return result({ error: "Could not save code; each code must be unique." }, 409);
      const { error: accessError } = await db
        .from("portal_access")
        .upsert({ credential_id: profile.id, role_key: profile.key, profile: safeProfile });
      if (accessError) return result({ error: "Could not save board access." }, 503);
    }
    const { data: access, error } = await db.from("portal_access").select("credential_id,profile");
    const { data: credentials, error: credentialError } = await db
      .from("portal_credentials")
      .select("id,code_ciphertext,active");
    if (error || credentialError) return result({ error: "Board access unavailable." }, 503);
    const records = await Promise.all(
      (access || []).map(async (row) => {
        const credential = credentials?.find((c) => c.id === row.credential_id);
        return {
          ...(row.profile as object),
          paused: !credential?.active,
          code: credential ? await crypt(credential.code_ciphertext, secret, true) : "",
        };
      }),
    );
    return result({ officials: records });
  }
  if (action === "profile") {
    if (!session.id) return result({ profile: null });
    const { data } = await db
      .from("portal_access")
      .select("profile")
      .eq("credential_id", session.id)
      .maybeSingle();
    return result({ profile: data?.profile || null });
  }
  if ((action === "state" || action === "delete-team") && request.method === "POST") {
    if (action === "delete-team" && !mayDeleteTeam(session.role))
      return result({ error: "Only Super Admin can delete teams." }, 403);
    const { data: current, error } = await db
      .from("league_shared_state")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error) return result({ error: "League data unavailable." }, 503);
    if (Number(body["revision"]) !== (current?.revision || 0))
      return result({ error: "League changed on another device. Refresh and retry." }, 409);
    if (!current && session.role !== "SUPER_ADMIN")
      return result({ error: "Super Admin must first save the league." }, 403);
    let data = { ...((current?.data || {}) as Record<string, unknown>) };
    let deleted = Array.isArray(current?.deleted_team_ids)
      ? (current.deleted_team_ids as number[])
      : [];
    if (action === "delete-team") {
      const id = Number(body["teamId"]);
      const currentTeams = Array.isArray(data["teams"]) ? (data["teams"] as { id: number }[]) : [];
      if (!Number.isSafeInteger(id) || !currentTeams.some((t) => t.id === id))
        return result({ error: "Team not found." }, 404);
      deleted = [...new Set([...deleted, id])];
    } else {
      const patch = body["data"];
      if (!patch || typeof patch !== "object")
        return result({ error: "Invalid league data." }, 400);
      const patchObj = patch as Record<string, unknown>;
      for (const field of allowedFields(session.role))
        if (field in patchObj) {
          if (!Array.isArray(patchObj[field]) || patchObj[field].length > 5000)
            return result({ error: "Invalid league records." }, 400);
          data[field] = patchObj[field];
        }
      if (current) {
        const incomingTeams = Array.isArray(data["teams"])
          ? (data["teams"] as { id: number }[])
          : [];
        const incomingIds = new Set(incomingTeams.map((t) => t.id));
        const existingTeams = Array.isArray((current.data as Record<string, unknown>)?.["teams"])
          ? ((current.data as Record<string, unknown>)["teams"] as { id: number }[])
          : [];
        if (existingTeams.some((t) => !incomingIds.has(t.id)))
          return result({ error: "Use the Super Admin delete-team action to remove a team." }, 403);
      }
    }
    data = removeDeletedTeams(data, deleted);
    const row = { id: 1, data, deleted_team_ids: deleted, revision: (current?.revision || 0) + 1 };
    const write = current
      ? await db
          .from("league_shared_state")
          .update(row)
          .eq("id", 1)
          .eq("revision", current.revision)
          .select("revision")
          .maybeSingle()
      : await db.from("league_shared_state").insert(row).select("revision").maybeSingle();
    if (write.error || !write.data)
      return result({ error: "Save failed or league changed. Refresh and retry." }, 409);
    return result(row);
  }
  if (action === "song" && request.method === "POST") {
    if (!["SUPER_ADMIN", "TECH_MANAGER", "ASST_TECH_MANAGER"].includes(session.role))
      return result({ error: "Only authorized media staff can change the anthem." }, 403);
    const id = String(body["youtubeId"] || "");
    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return result({ error: "Invalid YouTube video." }, 400);
    const { error } = await db.from("site_song").upsert({
      id: 1,
      youtube_id: id,
      youtube_url: "https://www.youtube.com/watch?v=" + id,
      title: String(body["title"] || "League Anthem").slice(0, 200),
      updated_at: new Date().toISOString(),
    });
    return error ? result({ error: "Anthem could not be saved." }, 503) : result({ ok: true });
  }
  return result({ error: "Action not available." }, 404);
});
