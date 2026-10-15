import React, { useState } from 'react';
import { useRoleAccess, ROLE_HIERARCHY_DATA, type LeagueRole } from '../hooks/useRoleAccess';

export function UserProfileView() {
  const {
    currentRole,
    roleTier,
    roleDetails,
    switchRole,
    authorizedActions,
    restrictedActions,
    isSuperAdmin,
  } = useRoleAccess();

  const [activeTab, setActiveTab] = useState<'authorized' | 'hierarchy' | 'restricted' | 'switch'>('authorized');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Governance', 'Registration', 'Match Officiating', 'Records & Stats', 'Digital & Media', 'Master Administrative'];

  const filteredAuthorized = authorizedActions.filter((action) => {
    if (filterCategory === 'ALL') return true;
    return action.category === filterCategory;
  });

  return (
    <div className="min-h-screen bg-[#070512] text-white p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation / Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2e2554]">
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-2xl bg-white border-2 border-emerald-400 p-1 flex items-center justify-center shrink-0 shadow-xl shadow-emerald-500/20">
              <img
                src="/mpesa-academy-icon.png"
                alt="M-Pesa Foundation Academy Crest"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/favicon.ico';
                }}
              />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-black animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400">
                  M-Pesa Foundation Academy
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded-full font-mono font-bold">
                  SECURITY CLEARANCE
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wider text-white">
                Official User Profile <span className="text-[#00f0ff]">& Role Access</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="/league.html"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00f0ff] via-emerald-400 to-[#00ff85] text-black font-extrabold text-xs shadow-lg hover:brightness-110 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to League Portal</span>
            </a>
          </div>
        </div>

        {/* HERO BADGE: CURRENT USER & ASSIGNED ROLE */}
        <div className="relative overflow-hidden rounded-3xl border border-[#2e2554] bg-[#141029] p-6 sm:p-8 shadow-2xl">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#1f193d] to-[#2e2554] border-2 border-[#00f0ff]/50 p-2 flex items-center justify-center shrink-0 shadow-xl">
                <img
                  src="/mpesa-academy-icon.png"
                  alt="Official Avatar"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`bg-gradient-to-r ${roleDetails.badgeColor} text-black font-black text-[11px] px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md`}>
                    {roleTier === 0 ? '👑 Master Tier' : `Tier ${roleTier} Executive`}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    Clearance: <span className="text-[#00f0ff] font-bold">{currentRole}</span>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-wide uppercase">
                  {roleDetails.officialName}
                </h2>

                <p className="text-sm text-[#00f0ff] font-bold">
                  {roleDetails.title} • <span className="text-gray-300 font-normal">{roleDetails.department}</span>
                </p>

                <p className="text-xs text-gray-400 max-w-xl leading-relaxed pt-1">
                  Active member of the M-Pesa Sunday League official leadership council. Authorized for role-specific operations in accordance with league regulations.
                </p>
              </div>
            </div>

            {/* Quick Stats / Action Count */}
            <div className="bg-[#070512]/80 border border-[#2e2554] rounded-2xl p-4 sm:p-5 flex items-center justify-around sm:justify-start gap-6 min-w-[240px] shrink-0">
              <div className="text-center">
                <span className="text-2xl sm:text-3xl font-black text-[#00ff85] block">
                  {authorizedActions.length}
                </span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Authorized Actions
                </span>
              </div>
              <div className="h-10 w-px bg-[#2e2554]" />
              <div className="text-center">
                <span className="text-2xl sm:text-3xl font-black text-amber-400 block">
                  {roleTier === 0 ? 'ALL' : `Tier ${roleTier}`}
                </span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Council Rank
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PROFILE NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-[#2e2554] pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('authorized')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'authorized'
                ? 'bg-[#00f0ff] text-black font-extrabold shadow-md'
                : 'text-gray-300 hover:bg-[#141029] hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Authorized Actions ({authorizedActions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('hierarchy')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'hierarchy'
                ? 'bg-[#00f0ff] text-black font-extrabold shadow-md'
                : 'text-gray-300 hover:bg-[#141029] hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>7-Tier Hierarchy Structure</span>
          </button>

          <button
            onClick={() => setActiveTab('restricted')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'restricted'
                ? 'bg-[#00f0ff] text-black font-extrabold shadow-md'
                : 'text-gray-300 hover:bg-[#141029] hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Restricted Actions ({restrictedActions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('switch')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'switch'
                ? 'bg-[#00f0ff] text-black font-extrabold shadow-md'
                : 'text-gray-300 hover:bg-[#141029] hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span>Role Switcher (Audit & Testing)</span>
          </button>
        </div>

        {/* TAB 1: AUTHORIZED ACTIONS */}
        {activeTab === 'authorized' && (
          <div className="space-y-4">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">Filter:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    filterCategory === cat
                      ? 'bg-emerald-400 text-black font-black'
                      : 'bg-[#141029] text-gray-300 hover:bg-[#1f193d]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAuthorized.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#2e2554] bg-[#141029]/80 p-4.5 space-y-2.5 hover:border-[#00f0ff]/50 transition group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[9px] uppercase font-black tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-black text-[#00ff85]">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      Authorized
                    </span>
                  </div>

                  <h3 className="font-extrabold text-white text-sm group-hover:text-[#00f0ff] transition">
                    {item.action}
                  </h3>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {filteredAuthorized.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-sm">No authorized actions found in this category for {roleDetails.title}.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: 7-TIER HIERARCHY STRUCTURE */}
        {activeTab === 'hierarchy' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#141029] border border-[#2e2554] text-xs text-gray-300 leading-relaxed">
              <p className="font-bold text-white mb-1">Official 7-Tier Council Governance Structure</p>
              The M-Pesa Sunday League executive authority is structured across seven appointed management portfolios. Higher tiers provide overarching direction and dispute adjudication, while department managers hold exclusive domain rights.
            </div>

            <div className="space-y-3">
              {(Object.keys(ROLE_HIERARCHY_DATA) as LeagueRole[])
                .filter((r) => r !== 'GUEST')
                .sort((a, b) => ROLE_HIERARCHY_DATA[a].tier - ROLE_HIERARCHY_DATA[b].tier)
                .map((rKey) => {
                  const meta = ROLE_HIERARCHY_DATA[rKey];
                  const isCurrent = currentRole === rKey;
                  return (
                    <div
                      key={rKey}
                      className={`rounded-2xl border p-4.5 transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isCurrent
                          ? 'border-[#00f0ff] bg-gradient-to-r from-[#141029] via-[#1f193d] to-[#141029] shadow-lg shadow-cyan-500/10'
                          : 'border-[#2e2554] bg-[#141029]/60 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${meta.badgeColor} text-black font-black flex items-center justify-center shrink-0 shadow`}>
                          {meta.tier === 0 ? '👑' : `T${meta.tier}`}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-white text-base">
                              {meta.title}
                            </span>
                            <span className="text-xs text-gray-400 font-mono">
                              ({meta.officialName})
                            </span>
                            {isCurrent && (
                              <span className="bg-[#00f0ff] text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                                Your Active Role
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#00f0ff]">{meta.department}</p>
                          <ul className="text-[11px] text-gray-400 space-y-0.5 pt-1">
                            {meta.responsibilities.slice(0, 2).map((resp, idx) => (
                              <li key={idx} className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-bold text-gray-400">
                          {meta.permissions.length} actions
                        </span>
                        <button
                          onClick={() => switchRole(rKey)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                            isCurrent
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white'
                          }`}
                        >
                          {isCurrent ? 'Current' : 'Select Role'}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 3: RESTRICTED ACTIONS */}
        {activeTab === 'restricted' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 leading-relaxed">
              <p className="font-bold text-rose-200 mb-1">Protected Actions Beyond Current Clearance</p>
              Actions listed below are restricted for your current role ({roleDetails.title}) to preserve separation of executive powers, match impartiality, and regulatory integrity.
            </div>

            {isSuperAdmin ? (
              <div className="text-center py-12 text-gray-400">
                <span className="text-3xl block mb-2">👑</span>
                <p className="text-sm font-bold text-white">Super Administrator Clearance</p>
                <p className="text-xs text-gray-400">You hold unrestricted authority across all 7 management tiers.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {restrictedActions.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-rose-500/20 bg-[#141029]/50 p-4.5 space-y-2 opacity-85"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[9px] uppercase font-black tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Restricted
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-200 text-sm">
                      {item.action}
                    </h3>

                    <p className="text-xs text-gray-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ROLE SWITCHER (FOR TESTING & DEMO) */}
        {activeTab === 'switch' && (
          <div className="rounded-3xl border border-[#2e2554] bg-[#141029] p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">Role Access Testing & Verification Desk</h3>
              <p className="text-xs text-gray-400">
                Select any of the 7 executive management tiers, Master Super Admin, or Public Fan to instantly inspect the authorized permissions and UI visibility rules.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(Object.keys(ROLE_HIERARCHY_DATA) as LeagueRole[]).map((rKey) => {
                const meta = ROLE_HIERARCHY_DATA[rKey];
                const isActive = currentRole === rKey;
                return (
                  <button
                    key={rKey}
                    onClick={() => switchRole(rKey)}
                    className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                      isActive
                        ? 'border-[#00f0ff] bg-gradient-to-r from-[#1f193d] to-[#141029] shadow-lg shadow-cyan-500/20 scale-102'
                        : 'border-[#2e2554] bg-[#070512] hover:bg-[#141029]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${meta.badgeColor} text-black font-black flex items-center justify-center shrink-0 text-xs`}>
                      {meta.tier === 0 ? '👑' : `T${meta.tier}`}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-white block">{meta.title}</span>
                      <span className="text-[11px] text-[#00f0ff] block">{meta.officialName}</span>
                      <span className="text-[10px] text-gray-400 block mt-1">
                        {meta.permissions.length} Authorized Actions
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
