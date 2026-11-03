import React, { useState, useEffect } from "react";
import {
  Database,
  RefreshCw,
  GitFork,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  Download,
  Copy,
  Table as TableIcon,
  Activity,
  Server,
  Zap,
  Users,
  Trophy,
  Calendar,
  Lock,
} from "lucide-react";
import {
  PLATFORM_SCHEMA_TABLES,
  generateFullSqlDdlMigration,
  type SchemaTable,
} from "../db/sportsSchema";
import {
  executeDataSyncPipeline,
  type SyncResult,
} from "../lib/sportsSyncPipeline";
import { getDbTeams, getDbPlayers, getDbFixtures } from "../lib/inbuiltDbSync";

type ViewMode = "erd" | "sync_pipeline" | "sql_ddl" | "data_explorer";

export function SportsDatabaseSchemaViewer() {
  const [activeMode, setActiveMode] = useState<ViewMode>("erd");
  const [selectedTable, setSelectedTable] = useState<SchemaTable>(PLATFORM_SCHEMA_TABLES[2]); // Default to teams
  const [isSyncing, setIsSyncing] = useState(false);
  const [apiSource, setApiSource] = useState("Football-Data.org Standard Feed");
  const [syncHistory, setSyncHistory] = useState<SyncResult[]>([]);
  const [activeSyncResult, setActiveSyncResult] = useState<SyncResult | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live data counts for Explorer
  const [liveTeamsCount, setLiveTeamsCount] = useState(0);
  const [livePlayersCount, setLivePlayersCount] = useState(0);
  const [liveMatchesCount, setLiveMatchesCount] = useState(0);

  useEffect(() => {
    const refreshCounts = () => {
      setLiveTeamsCount(getDbTeams().length);
      setLivePlayersCount(getDbPlayers().length);
      setLiveMatchesCount(getDbFixtures().length);
    };
    refreshCounts();

    // Load past sync history
    try {
      const past = localStorage.getItem("mpesa_sync_audit_logs_v1");
      if (past) {
        const parsed = JSON.parse(past);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSyncHistory(parsed);
          setActiveSyncResult(parsed[0]);
        }
      }
    } catch {
      // ignore
    }

    window.addEventListener("mpesa_db_updated", refreshCounts);
    return () => window.removeEventListener("mpesa_db_updated", refreshCounts);
  }, []);

  const handleRunSync = async () => {
    setIsSyncing(true);
    setToastMessage(`Connecting to ${apiSource}...`);

    try {
      const result = await executeDataSyncPipeline(apiSource);
      setActiveSyncResult(result);
      setSyncHistory((prev) => [result, ...prev.slice(0, 9)]);
      const totalRecords = result.teamsSynced + result.playersSynced + result.matchesSynced;
      setToastMessage(`✓ Pipeline completed: ${totalRecords} records synchronized cleanly!`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      setIsSyncing(false);
      setToastMessage(`⚠ Sync error: ${err?.message || "Failed to complete data sync"}`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleCopySql = () => {
    const ddl = generateFullSqlDdlMigration();
    navigator.clipboard.writeText(ddl);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleDownloadSql = () => {
    const ddl = generateFullSqlDdlMigration();
    const blob = new Blob([ddl], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sports_management_schema_migration.sql";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-black text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-emerald-300 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#2e2554] pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                Relational Architecture & Web Sync Engine
              </span>
              <span className="text-[10px] font-bold text-gray-400 font-mono">
                PostgreSQL • FIFA Point System • ACID
              </span>
            </div>
            <h2 className="font-header text-xl sm:text-2xl font-black text-white uppercase tracking-wider mt-0.5">
              Comprehensive Database Schema & Sync Engine
            </h2>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#120d30] rounded-2xl border border-[#2e2554]">
          <button
            type="button"
            onClick={() => setActiveMode("erd")}
            className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer ${
              activeMode === "erd"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md shadow-cyan-500/25"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>ERD Architecture</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode("sync_pipeline")}
            className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer ${
              activeMode === "sync_pipeline"
                ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-black shadow-md shadow-emerald-400/25"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span>Data Sync Pipeline</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode("sql_ddl")}
            className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer ${
              activeMode === "sql_ddl"
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>SQL Migration</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode("data_explorer")}
            className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer ${
              activeMode === "data_explorer"
                ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-md shadow-amber-400/25"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table Browser</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 bg-[#120e2e] border border-[#2e2554] rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black">
            {PLATFORM_SCHEMA_TABLES.length}
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-bold">Relational Tables</div>
            <div className="text-white font-black text-sm">9 Core Entities</div>
          </div>
        </div>

        <div className="p-3.5 bg-[#120e2e] border border-[#2e2554] rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
            {liveTeamsCount}
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-bold">Active Clubs</div>
            <div className="text-white font-black text-sm">{liveTeamsCount} Verified Teams</div>
          </div>
        </div>

        <div className="p-3.5 bg-[#120e2e] border border-[#2e2554] rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black">
            {livePlayersCount}
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-bold">Registered Athletes</div>
            <div className="text-white font-black text-sm">{livePlayersCount} Roster Players</div>
          </div>
        </div>

        <div className="p-3.5 bg-[#120e2e] border border-[#2e2554] rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-black">
            {liveMatchesCount}
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-bold">Fixtures & Scores</div>
            <div className="text-white font-black text-sm">{liveMatchesCount} Matches Logged</div>
          </div>
        </div>
      </div>

      {/* =========================================================
          VIEW 1: ENTITY RELATIONSHIP DIAGRAM (ERD) & TABLE DETAIL
          ========================================================= */}
      {activeMode === "erd" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Table Directory Sidebar */}
            <div className="lg:col-span-4 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block px-1">
                Relational Platform Entities
              </span>
              <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
                {PLATFORM_SCHEMA_TABLES.map((t) => {
                  const isSelected = selectedTable.tableName === t.tableName;
                  return (
                    <button
                      key={t.tableName}
                      type="button"
                      onClick={() => setSelectedTable(t)}
                      className={`w-full text-left p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border-cyan-400 text-white shadow-lg shadow-cyan-500/10"
                          : "bg-[#120e2e] border-[#2e2554] text-gray-300 hover:border-gray-500"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-cyan-300">
                            {t.tableName}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-400 font-mono">
                            {t.fields.length} cols
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-400 truncate max-w-[210px]">
                          {t.displayName}
                        </div>
                      </div>
                      <ArrowRight className={`w-4 h-4 transition ${isSelected ? "text-cyan-400 translate-x-0.5" : "text-gray-600"}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Table Detail & Attributes Card */}
            <div className="lg:col-span-8 bg-[#120e2e] border border-[#2e2554] rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2e2554] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                      Primary Key: {selectedTable.primaryKey}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      Category: {selectedTable.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white font-mono uppercase mt-1">
                    Table: {selectedTable.tableName} ({selectedTable.displayName})
                  </h3>
                  <p className="text-xs text-gray-300">{selectedTable.description}</p>
                </div>
              </div>

              {/* Fields Table */}
              <div className="overflow-x-auto rounded-xl border border-[#2e2554]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#17113a] text-gray-400 uppercase text-[10px] font-mono tracking-wider border-b border-[#2e2554]">
                      <th className="py-2.5 px-3">Column Name</th>
                      <th className="py-2.5 px-3">Data Type</th>
                      <th className="py-2.5 px-3 text-center">Attributes</th>
                      <th className="py-2.5 px-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#20184d]">
                    {selectedTable.fields.map((field) => (
                      <tr key={field.name} className="hover:bg-[#1a1440]/60 transition">
                        <td className="py-2.5 px-3 font-mono font-black text-cyan-300 flex items-center gap-1.5">
                          {field.isPrimary && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-400 text-black uppercase">
                              PK
                            </span>
                          )}
                          {field.isForeign && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-purple-500 text-white uppercase">
                              FK
                            </span>
                          )}
                          <span>{field.name}</span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-gray-300 text-[11px]">
                          {field.type}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {field.isNullable === false ? (
                            <span className="text-[10px] text-rose-400 font-mono">NOT NULL</span>
                          ) : (
                            <span className="text-[10px] text-gray-500 font-mono">NULLABLE</span>
                          )}
                          {field.isUnique && (
                            <span className="ml-1 text-[10px] text-emerald-400 font-mono">UNIQUE</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-gray-300 text-[11px]">
                          {field.description}
                          {field.foreignTarget && (
                            <span className="block text-[10px] text-purple-400 font-mono">
                              ↳ References: {field.foreignTarget}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Relational Mapping Blueprint */}
              <div className="p-3.5 bg-[#090618] rounded-xl border border-white/5 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
                  Relational Links & Integrity Constraints:
                </span>
                <div className="text-xs text-gray-300 space-y-1 font-mono text-[11px]">
                  {selectedTable.tableName === "matches" && (
                    <>
                      <div>• <strong>Foreign Key:</strong> season_id → seasons(season_id) ON DELETE CASCADE</div>
                      <div>• <strong>Foreign Key:</strong> home_team_id → teams(team_id) ON DELETE RESTRICT</div>
                      <div>• <strong>Foreign Key:</strong> away_team_id → teams(team_id) ON DELETE RESTRICT</div>
                      <div>• <strong>Integrity Constraint:</strong> CHECK (home_team_id != away_team_id)</div>
                    </>
                  )}
                  {selectedTable.tableName === "players" && (
                    <>
                      <div>• <strong>Foreign Key:</strong> team_id → teams(team_id) ON DELETE CASCADE</div>
                      <div>• <strong>Unique Composite:</strong> UNIQUE(team_id, jersey_number)</div>
                      <div>• <strong>Domain Constraint:</strong> CHECK (position IN (&apos;GK&apos;, &apos;DEF&apos;, &apos;MID&apos;, &apos;FWD&apos;))</div>
                    </>
                  )}
                  {selectedTable.tableName === "standings" && (
                    <>
                      <div>• <strong>Computed Columns:</strong> goal_difference GENERATED ALWAYS AS (goals_for - goals_against)</div>
                      <div>• <strong>Points Calculation:</strong> points GENERATED ALWAYS AS (wins * 3 + draws * 1)</div>
                      <div>• <strong>Form Guide:</strong> Verified real-time last 5 results (W, D, L)</div>
                    </>
                  )}
                  {selectedTable.tableName !== "matches" && selectedTable.tableName !== "players" && selectedTable.tableName !== "standings" && (
                    <div>• ACID Transaction-safe constraints with auto-updating updated_at trigger.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          VIEW 2: DATA FETCHING & SYNCHRONIZATION PIPELINE
          ========================================================= */}
      {activeMode === "sync_pipeline" && (
        <div className="space-y-6">
          {/* Sync Trigger Card */}
          <div className="p-6 bg-gradient-to-r from-[#171138] via-[#100c2a] to-[#090619] border-2 border-emerald-500/40 rounded-3xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                  Automated Sports API Data Pipeline
                </span>
                <h3 className="text-xl font-black text-white uppercase tracking-wider">
                  Real-World Web Data Synchronization
                </h3>
                <p className="text-xs text-gray-300 max-w-xl mt-1">
                  Fetches verified sports data feeds, performs deterministic UPSERTs, deduplicates athlete records via natural keys, and guarantees zero relational integrity violations.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={apiSource}
                  onChange={(e) => setApiSource(e.target.value)}
                  className="bg-[#0b0821] border border-[#2e2554] rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                >
                  <option value="Football-Data.org Standard Feed">Football-Data.org Feed</option>
                  <option value="API-Football RapidAPI Gateway">API-Football Gateway</option>
                  <option value="Academy Central Sports Webhook">Academy Webhook Feed</option>
                </select>

                <button
                  type="button"
                  onClick={handleRunSync}
                  disabled={isSyncing}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:brightness-110 active:scale-95 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                  <span>{isSyncing ? "Synchronizing..." : "Fetch & Sync Live Data"}</span>
                </button>
              </div>
            </div>

            {/* Pipeline Architecture Safeguards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-[#2e2554]">
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                <div className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Deterministic Upserts</span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Existing records update in-place; new clubs and athletes append smoothly without ID collisions.
                </p>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                <div className="text-cyan-400 font-bold text-xs flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Zero Data Duplication</span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Enforces natural composite keys like (team_id, jersey_number) and (season_id, matchweek).
                </p>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                <div className="text-purple-400 font-bold text-xs flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Real-Time Broadcast</span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Dispatches cross-tab update events immediately updating standings, form guides, and player stats.
                </p>
              </div>
            </div>
          </div>

          {/* Sync Execution Output Terminal */}
          {activeSyncResult && (
            <div className="bg-[#090615] border border-[#2e2554] rounded-2xl p-5 space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-[#2e2554] pb-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-bold text-white uppercase">Pipeline Execution Report</span>
                  <span className="text-gray-400">({activeSyncResult.syncId})</span>
                </div>
                <span className="text-emerald-300 text-[11px]">
                  Duration: {activeSyncResult.durationMs}ms • Status: {activeSyncResult.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] py-1">
                <div className="p-2 bg-[#120e2e] rounded border border-white/5">
                  <span className="text-gray-400 block">Teams Synchronized:</span>
                  <strong className="text-cyan-300">{activeSyncResult.teamsSynced} Clubs</strong>
                </div>
                <div className="p-2 bg-[#120e2e] rounded border border-white/5">
                  <span className="text-gray-400 block">Squad Athletes:</span>
                  <strong className="text-emerald-300">{activeSyncResult.playersSynced} Players</strong>
                </div>
                <div className="p-2 bg-[#120e2e] rounded border border-white/5">
                  <span className="text-gray-400 block">Fixtures Updated:</span>
                  <strong className="text-amber-300">{activeSyncResult.matchesSynced} Matches</strong>
                </div>
                <div className="p-2 bg-[#120e2e] rounded border border-white/5">
                  <span className="text-gray-400 block">Harmonized Records:</span>
                  <strong className="text-purple-300">{activeSyncResult.conflictsResolved} Deduplicated</strong>
                </div>
              </div>

              {/* Logs Console */}
              <div className="bg-black/60 rounded-xl p-3 max-h-48 overflow-y-auto space-y-1 text-[11px] text-gray-300 custom-scrollbar border border-white/5">
                {activeSyncResult.logs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed">
                    <span className="text-emerald-400 mr-2">›</span>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          VIEW 3: SQL DDL MIGRATION SCRIPT
          ========================================================= */}
      {activeMode === "sql_ddl" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-3">
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-400" />
                Complete PostgreSQL Relational DDL Script
              </h3>
              <p className="text-xs text-gray-400">
                Ready-to-execute schema migration file with tables, foreign keys, cascade rules, and automated timestamp triggers.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopySql}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedSql ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? "Copied!" : "Copy SQL"}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadSql}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition shadow cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download .SQL</span>
              </button>
            </div>
          </div>

          <div className="bg-[#080515] rounded-2xl p-4 border border-[#2e2554] max-h-[520px] overflow-y-auto custom-scrollbar">
            <pre className="font-mono text-xs text-cyan-200 leading-relaxed whitespace-pre">
              {generateFullSqlDdlMigration()}
            </pre>
          </div>
        </div>
      )}

      {/* =========================================================
          VIEW 4: RELATIONAL TABLE DATA BROWSER (CLEAN PRIVACY VIEW)
          ========================================================= */}
      {activeMode === "data_explorer" && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-emerald-300 block">
                  Strict UI Privacy Enforced
                </span>
                <span className="text-gray-300 text-[11px]">
                  All raw technical codes, internal database IDs, and system keys are hidden from the user interface. Displaying human-readable labels and verified club names only.
                </span>
              </div>
            </div>
          </div>

          {/* Quick Tab Selector for Data Browser */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#120e2e] border border-[#2e2554] rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-[#2e2554] pb-2">
                <span className="font-bold text-sm text-cyan-300 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4" />
                  Teams Registry
                </span>
                <span className="text-xs text-gray-400 font-mono">{liveTeamsCount} Clubs</span>
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {getDbTeams().map((t) => (
                  <div key={t.id} className="p-2.5 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-black text-white">{t.name}</div>
                      <div className="text-[10px] text-gray-400">Coach: {t.coachName || "Head Coach"}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase text-black" style={{ backgroundColor: t.color }}>
                      {t.shortCode}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#120e2e] border border-[#2e2554] rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-[#2e2554] pb-2">
                <span className="font-bold text-sm text-emerald-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  Athlete Squads
                </span>
                <span className="text-xs text-gray-400 font-mono">{livePlayersCount} Players</span>
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {getDbPlayers().slice(0, 10).map((p) => (
                  <div key={p.id} className="p-2.5 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-black text-white">{p.name} (#{p.number})</div>
                      <div className="text-[10px] text-gray-400">{p.teamName}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                      {p.position}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#120e2e] border border-[#2e2554] rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-[#2e2554] pb-2">
                <span className="font-bold text-sm text-amber-300 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  League Fixtures
                </span>
                <span className="text-xs text-gray-400 font-mono">{liveMatchesCount} Matches</span>
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {getDbFixtures().map((f) => (
                  <div key={f.id} className="p-2.5 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white text-[11px]">
                        {f.homeTeamName} vs {f.awayTeamName}
                      </div>
                      <div className="text-[10px] text-gray-400">Matchweek {f.matchweek} • {f.venue}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-gray-300">
                      {f.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
