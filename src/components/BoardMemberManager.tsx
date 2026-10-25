import React, { useState, useEffect } from "react";
import {
  KeyRound,
  UserPlus,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Eye,
  EyeOff,
  Mail,
  Edit3,
  Search,
  X,
  Check,
} from "lucide-react";
import {
  getRegisteredBoardMembers,
  registerBoardMember,
  updateBoardMember,
  deleteBoardMember,
  ROLE_DEPARTMENT_MAP,
  type RegisteredBoardMember,
} from "../lib/boardMembersRegistry";
import type { LeagueRole } from "../hooks/useRoleAccess";

export function BoardMemberManager() {
  const [members, setMembers] = useState<RegisteredBoardMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New member form state
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<Exclude<LeagueRole, "SUPER_ADMIN" | "GUEST">>("PRESIDENT");
  const [newEmail, setNewEmail] = useState("");
  const [newCode, setNewCode] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Edit existing member modal state
  const [editingMember, setEditingMember] = useState<RegisteredBoardMember | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] =
    useState<Exclude<LeagueRole, "SUPER_ADMIN" | "GUEST">>("PRESIDENT");
  const [editEmail, setEditEmail] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editActive, setEditActive] = useState(true);
  const [editError, setEditError] = useState<string | null>(null);

  // Code visibility toggle per member
  const [visibleCodes, setVisibleCodes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMembers(getRegisteredBoardMembers());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleGenerateCode = (role: string) => {
    const prefix = role.slice(0, 4).toUpperCase();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${randomDigits}`;
  };

  const handleOpenAddForm = () => {
    setNewName("");
    setNewEmail("");
    setNewRole("PRESIDENT");
    setNewCode(handleGenerateCode("PRESIDENT"));
    setFormError(null);
    setShowAddForm(true);
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = newName.trim();
    const trimmedEmail = newEmail.trim().toLowerCase();
    const trimmedCode = newCode.trim().toUpperCase();

    if (!trimmedName) {
      setFormError("Please enter the board member's full name.");
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setFormError("Please enter a valid school email address.");
      return;
    }
    if (!trimmedCode) {
      setFormError("Please assign or generate a confidential access code.");
      return;
    }

    // Check code collision
    const existingCode = members.find((m) => m.accessCode.trim().toUpperCase() === trimmedCode);
    if (existingCode) {
      setFormError(
        `Access code ${trimmedCode} is already assigned to ${existingCode.name}. Please generate a unique code.`,
      );
      return;
    }

    const created = registerBoardMember({
      name: trimmedName,
      role: newRole,
      department: ROLE_DEPARTMENT_MAP[newRole],
      schoolEmail: trimmedEmail,
      accessCode: trimmedCode,
      assignedBy: "Super Admin",
      active: true,
    });

    setMembers(getRegisteredBoardMembers());
    setShowAddForm(false);
    showToast(`✓ Board Member ${created.name} registered successfully!`);
  };

  const handleOpenEdit = (member: RegisteredBoardMember) => {
    setEditingMember(member);
    setEditName(member.name);
    setEditRole(member.role as Exclude<LeagueRole, "SUPER_ADMIN" | "GUEST">);
    setEditEmail(member.schoolEmail);
    setEditCode(member.accessCode);
    setEditActive(member.active);
    setEditError(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    setEditError(null);

    const trimmedName = editName.trim();
    const trimmedEmail = editEmail.trim().toLowerCase();
    const trimmedCode = editCode.trim().toUpperCase();

    if (!trimmedName) {
      setEditError("Please enter the board member's full name.");
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setEditError("Please enter a valid school email address.");
      return;
    }
    if (!trimmedCode) {
      setEditError("Access code cannot be empty.");
      return;
    }

    // Check collision with other members
    const collision = members.find(
      (m) => m.id !== editingMember.id && m.accessCode.trim().toUpperCase() === trimmedCode,
    );
    if (collision) {
      setEditError(`Access code ${trimmedCode} is already assigned to ${collision.name}.`);
      return;
    }

    const updated = updateBoardMember(editingMember.id, {
      name: trimmedName,
      role: editRole,
      department: ROLE_DEPARTMENT_MAP[editRole],
      schoolEmail: trimmedEmail,
      accessCode: trimmedCode,
      active: editActive,
    });

    setMembers(updated);
    setEditingMember(null);
    showToast(`✓ Member ${trimmedName} updated successfully!`);
  };

  const handleRegenerateMemberCode = (member: RegisteredBoardMember) => {
    const updatedCode = handleGenerateCode(member.role);
    const updated = updateBoardMember(member.id, { accessCode: updatedCode });
    setMembers(updated);
    showToast(`✓ New code ${updatedCode} generated for ${member.name}`);
  };

  const handleToggleStatus = (member: RegisteredBoardMember) => {
    const updated = updateBoardMember(member.id, { active: !member.active });
    setMembers(updated);
    showToast(`✓ ${member.name} status updated to: ${!member.active ? "Active" : "Suspended"}`);
  };

  const handleDelete = (member: RegisteredBoardMember) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete and revoke access for ${member.name}?`,
      )
    ) {
      const updated = deleteBoardMember(member.id);
      setMembers(updated);
      showToast(`✓ Permanently deleted ${member.name} from board roster.`);
    }
  };

  const handleCopyCode = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      showToast("✓ Access code copied to clipboard");
    }
  };

  const toggleCodeVisibility = (id: string) => {
    setVisibleCodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredMembers = members.filter((m) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.department.toLowerCase().includes(q) ||
      m.schoolEmail.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-[#0b0821] border-2 border-amber-400/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-amber-400 text-black font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-yellow-300 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-black" />
          <span className="text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <h4 className="font-header text-base sm:text-lg font-black text-white uppercase tracking-wide">
              Council Board Member Registry & Credentials
            </h4>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Register new council members, edit current members, configure access codes, or revoke
            credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenAddForm}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-black font-black text-xs uppercase tracking-wide transition shadow-lg shadow-amber-500/20 cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Board Member</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#141029] p-3 rounded-2xl border border-[#2e2554]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search member name, department, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0a071b] border border-[#2e2554] focus:border-amber-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-300 font-mono w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-[11px] text-gray-400">Total Members:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold">
            {members.length} Registered
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 font-bold">
            {members.filter((m) => m.active).length} Active
          </span>
        </div>
      </div>

      {/* Registration Form Modal / Panel */}
      {showAddForm && (
        <div className="bg-[#141029] border-2 border-amber-400/50 rounded-2xl p-5 space-y-4 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-[#2e2554] pb-2">
            <h5 className="text-xs font-black uppercase text-amber-300 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-amber-400" />
              Register New Board Member
            </h5>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreateMember} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Full Official Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bramuel Amirah"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#0a071b] border border-[#2e2554] focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Board Role & Executive Department
                </label>
                <select
                  value={newRole}
                  onChange={(e) => {
                    const r = e.target.value as Exclude<LeagueRole, "SUPER_ADMIN" | "GUEST">;
                    setNewRole(r);
                    setNewCode(handleGenerateCode(r));
                  }}
                  className="w-full bg-[#0a071b] border border-[#2e2554] focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs font-bold text-white outline-none"
                >
                  <option value="PRESIDENT">President — Executive Governance (Tier 1)</option>
                  <option value="DEPUTY_PRESIDENT">
                    Deputy President — Executive Governance (Tier 2)
                  </option>
                  <option value="REGULATIONS_MANAGER">Regulations & Registration (Tier 3)</option>
                  <option value="MATCH_OFFICIATING_MANAGER">
                    Match Officiating Programmes (Tier 4)
                  </option>
                  <option value="RECORDS_MANAGER">Records & Files (Tier 5)</option>
                  <option value="TECH_MANAGER">Technological Management (Tier 6)</option>
                  <option value="ASST_TECH_MANAGER">Assistant Technological (Tier 7)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Official School Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. member@mpesa.ac.ke"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-[#0a071b] border border-[#2e2554] focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-gray-400 font-bold uppercase text-[10px]">
                    Assigned Confidential Access Code
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewCode(handleGenerateCode(newRole))}
                    className="text-[10px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Generate New</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. PRES-8491"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#0a071b] border border-[#2e2554] focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-amber-300 outline-none"
                />
              </div>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2e2554]">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black uppercase hover:brightness-110 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                Save & Issue Credentials
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#100c2a] border-2 border-cyan-400/50 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-cyan-400" />
                <h4 className="font-header text-base font-black text-white uppercase">
                  Edit Board Member: {editingMember.name}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="text-gray-400 hover:text-white p-1 rounded-xl hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#161138] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Executive Role & Department
                </label>
                <select
                  value={editRole}
                  onChange={(e) => {
                    const r = e.target.value as Exclude<LeagueRole, "SUPER_ADMIN" | "GUEST">;
                    setEditRole(r);
                  }}
                  className="w-full bg-[#161138] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3 py-2.5 text-xs font-bold text-white outline-none"
                >
                  <option value="PRESIDENT">President — Executive Governance (Tier 1)</option>
                  <option value="DEPUTY_PRESIDENT">
                    Deputy President — Executive Governance (Tier 2)
                  </option>
                  <option value="REGULATIONS_MANAGER">Regulations & Registration (Tier 3)</option>
                  <option value="MATCH_OFFICIATING_MANAGER">
                    Match Officiating Programmes (Tier 4)
                  </option>
                  <option value="RECORDS_MANAGER">Records & Files (Tier 5)</option>
                  <option value="TECH_MANAGER">Technological Management (Tier 6)</option>
                  <option value="ASST_TECH_MANAGER">Assistant Technological (Tier 7)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Official School Email
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-[#161138] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-gray-400 font-bold uppercase text-[10px]">
                    Assigned Access Code
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditCode(handleGenerateCode(editRole))}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Regenerate</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={editCode}
                  onChange={(e) => setEditCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#161138] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-cyan-300 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="edit-active-toggle"
                  checked={editActive}
                  onChange={(e) => setEditActive(e.target.checked)}
                  className="w-4 h-4 accent-emerald-400 rounded cursor-pointer"
                />
                <label
                  htmlFor="edit-active-toggle"
                  className="text-xs text-white font-bold cursor-pointer"
                >
                  Member Active & Authorized for Login
                </label>
              </div>

              {editError && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2e2554]">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-xs font-black uppercase hover:brightness-110 shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-black" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredMembers.map((member) => {
          const isVisible = !!visibleCodes[member.id];

          return (
            <div
              key={member.id}
              className={`p-4 rounded-2xl border transition space-y-3 ${
                member.active
                  ? "bg-[#141029] border-[#2e2554] hover:border-amber-400/40 shadow-lg"
                  : "bg-red-950/20 border-red-500/30 opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wide block">
                    {member.department}
                  </span>
                  <h5 className="text-sm font-black text-white">{member.name}</h5>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      member.active
                        ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                        : "bg-rose-400/20 text-rose-300 border border-rose-400/30"
                    }`}
                  >
                    {member.active ? "Active" : "Suspended"}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-gray-400 flex items-center gap-1.5 font-mono truncate">
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{member.schoolEmail}</span>
              </div>

              {/* Secret Access Code Box */}
              <div className="p-2.5 bg-[#090615] rounded-xl border border-[#261f4d] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-gray-500 uppercase font-bold">Code:</span>
                  <code className="text-xs font-mono font-black text-amber-300 tracking-wider">
                    {isVisible ? member.accessCode : "••••••••••"}
                  </code>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleCodeVisibility(member.id)}
                    title={isVisible ? "Hide Code" : "Show Code"}
                    className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-white/10 cursor-pointer"
                  >
                    {isVisible ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(member.accessCode)}
                    title="Copy Code"
                    className="p-1.5 text-gray-400 hover:text-amber-400 rounded hover:bg-white/10 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRegenerateMemberCode(member)}
                    title="Generate New Code"
                    className="p-1.5 text-gray-400 hover:text-cyan-400 rounded hover:bg-white/10 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Actions Footer: Edit, Toggle Status, Delete */}
              <div className="flex items-center justify-between pt-2 border-t border-[#261f4d] text-xs">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(member)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold flex items-center gap-1 text-[11px] transition cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Member</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(member)}
                    className={`font-bold transition text-[11px] ${
                      member.active
                        ? "text-yellow-400 hover:text-yellow-300"
                        : "text-emerald-400 hover:text-emerald-300"
                    }`}
                  >
                    {member.active ? "Suspend" : "Activate"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(member)}
                    className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold flex items-center gap-1 text-[11px] transition cursor-pointer"
                    title="Delete Board Member"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMembers.length === 0 && (
        <div className="p-8 text-center text-gray-400 bg-[#141029] rounded-2xl border border-[#2e2554]">
          <p className="text-xs">No board members match your search query "{searchQuery}".</p>
        </div>
      )}
    </div>
  );
}
