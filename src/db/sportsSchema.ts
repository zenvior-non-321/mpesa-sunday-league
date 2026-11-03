/**
 * Comprehensive Relational Database Schema Design for Sports Management Platform
 * Covers Leagues, Seasons, Teams, Players, Matches, Detailed Match Events,
 * Standings Table, User Management & Authentication, and Sync Audit Logs.
 */

export interface SchemaField {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  foreignTarget?: string;
  isNullable?: boolean;
  isUnique?: boolean;
  defaultValue?: string;
  description: string;
}

export interface SchemaTable {
  tableName: string;
  displayName: string;
  description: string;
  category: "Core Competition" | "Athletes & Staff" | "Match Operations" | "Analytics" | "Security & System";
  primaryKey: string;
  fields: SchemaField[];
}

export const PLATFORM_SCHEMA_TABLES: SchemaTable[] = [
  {
    tableName: "leagues",
    displayName: "Leagues & Tournaments",
    description: "Governing tournaments and championship tiers across sports competitions.",
    category: "Core Competition",
    primaryKey: "league_id",
    fields: [
      { name: "league_id", type: "UUID", isPrimary: true, description: "Unique identifier for tournament" },
      { name: "name", type: "VARCHAR(120)", isNullable: false, description: "Official tournament name (e.g. M-Pesa Sunday League)" },
      { name: "short_code", type: "VARCHAR(10)", isUnique: true, isNullable: false, description: "Display abbreviation (e.g. MSL)" },
      { name: "country", type: "VARCHAR(80)", defaultValue: "'Kenya'", description: "Host nation or regulatory region" },
      { name: "division_tier", type: "INTEGER", defaultValue: "1", description: "Competitive tier level (1 = Premier)" },
      { name: "logo_url", type: "TEXT", isNullable: true, description: "Branded competition crest asset" },
      { name: "created_at", type: "TIMESTAMPTZ", defaultValue: "NOW()", description: "Record creation timestamp" },
      { name: "updated_at", type: "TIMESTAMPTZ", defaultValue: "NOW()", description: "Last structural change timestamp" },
    ],
  },
  {
    tableName: "seasons",
    displayName: "Competition Seasons",
    description: "Annual or seasonal championship cycles with points systems and rules.",
    category: "Core Competition",
    primaryKey: "season_id",
    fields: [
      { name: "season_id", type: "UUID", isPrimary: true, description: "Unique season cycle identifier" },
      { name: "league_id", type: "UUID", isForeign: true, foreignTarget: "leagues.league_id", isNullable: false, description: "Parent tournament identifier" },
      { name: "season_name", type: "VARCHAR(60)", isNullable: false, description: "Calendar season label (e.g. 2026/2027 Season)" },
      { name: "start_date", type: "DATE", isNullable: false, description: "Opening matchday date" },
      { name: "end_date", type: "DATE", isNullable: false, description: "Championship final match date" },
      { name: "is_current", type: "BOOLEAN", defaultValue: "TRUE", description: "Whether this season is actively being played" },
      { name: "points_for_win", type: "SMALLINT", defaultValue: "3", description: "Points awarded for win (Standard FIFA 3)" },
      { name: "points_for_draw", type: "SMALLINT", defaultValue: "1", description: "Points awarded for draw (Standard FIFA 1)" },
      { name: "points_for_loss", type: "SMALLINT", defaultValue: "0", description: "Points awarded for loss" },
      { name: "created_at", type: "TIMESTAMPTZ", defaultValue: "NOW()", description: "System audit creation timestamp" },
    ],
  },
  {
    tableName: "teams",
    displayName: "Teams & Football Clubs",
    description: "Participating football clubs, venues, ownership, and managerial profiles.",
    category: "Core Competition",
    primaryKey: "team_id",
    fields: [
      { name: "team_id", type: "UUID", isPrimary: true, description: "Platform team primary identifier" },
      { name: "external_api_id", type: "VARCHAR(64)", isUnique: true, isNullable: true, description: "External web API sync ID for deduplication" },
      { name: "official_name", type: "VARCHAR(100)", isNullable: false, isUnique: true, description: "Full registered team name (e.g. Samba Boys)" },
      { name: "short_name", type: "VARCHAR(12)", isNullable: false, description: "Broadcasting short tag (e.g. SAM)" },
      { name: "theme_color", type: "VARCHAR(24)", defaultValue: "'#00ff85'", description: "Primary club hex color" },
      { name: "logo_url", type: "TEXT", isNullable: true, description: "Club badge icon or vector SVG" },
      { name: "home_venue", type: "VARCHAR(120)", isNullable: false, description: "Designated home stadium or pitch arena" },
      { name: "founded_year", type: "INTEGER", defaultValue: "2023", description: "Academy club founding year" },
      { name: "manager_name", type: "VARCHAR(80)", isNullable: false, description: "Appointed head coach / manager" },
      { name: "assistant_manager", type: "VARCHAR(80)", isNullable: true, description: "Assistant tactician or technical director" },
      { name: "created_at", type: "TIMESTAMPTZ", defaultValue: "NOW()", description: "Registration timestamp" },
      { name: "updated_at", type: "TIMESTAMPTZ", defaultValue: "NOW()", description: "Last profile synchronization" },
    ],
  },
  {
    tableName: "players",
    displayName: "Squad Athletes & Players",
    description: "Individual player profiles, technical positions, and squad affiliations.",
    category: "Athletes & Staff",
    primaryKey: "player_id",
    fields: [
      { name: "player_id", type: "UUID", isPrimary: true, description: "Unique athlete primary key" },
      { name: "external_api_id", type: "VARCHAR(64)", isUnique: true, isNullable: true, description: "External sports feed player sync key" },
      { name: "team_id", type: "UUID", isForeign: true, foreignTarget: "teams.team_id", isNullable: false, description: "Contracted / affiliated team" },
      { name: "full_name", type: "VARCHAR(90)", isNullable: false, description: "Player complete student / athlete name" },
      { name: "position", type: "VARCHAR(10)", isNullable: false, description: "Primary tactical position (GK, DEF, MID, FWD)" },
      { name: "jersey_number", type: "SMALLINT", isNullable: false, description: "Kit squad shirt number (1-99)" },
      { name: "nationality", type: "VARCHAR(60)", defaultValue: "'Kenyan'", description: "Player country of origin" },
      { name: "birthdate", type: "DATE", isNullable: true, description: "Athlete date of birth" },
      { name: "preferred_foot", type: "VARCHAR(10)", defaultValue: "'Right'", description: "Kicking preference (Right, Left, Both)" },
      { name: "profile_picture_url", type: "TEXT", isNullable: true, description: "Verified student portrait photo" },
      { name: "is_captain", type: "BOOLEAN", defaultValue: "FALSE", description: "Whether athlete holds team captaincy" },
      { name: "is_active", type: "BOOLEAN", defaultValue: "TRUE", description: "Active eligibility status" },
      { name: "created_at", type: "TIMESTAMPTZ", defaultValue: "NOW()", description: "First enrollment date" },
      { name: "updated_at", type: "TIMESTAMPTZ", defaultValue: "NOW()", description: "Last stat / profile sync" },
    ],
  },
  {
    tableName: "matches",
    displayName: "Matches, Fixtures & Scorecards",
    description: "Official match fixtures, scheduling, pitch location, and live scores.",
    category: "Match Operations",
    primaryKey: "match_id",
    fields: [
      { name: "match_id", type: "UUID", isPrimary: true, description: "Unique match fixture identifier" },
      { name: "external_api_id", type: "VARCHAR(64)", isUnique: true, isNullable: true, description: "External sports API match sync ID" },
      { name: "season_id", type: "UUID", isForeign: true, foreignTarget: "seasons.season_id", isNullable: false, description: "Tournament season cycle" },
      { name: "matchweek", type: "SMALLINT", isNullable: false, description: "Championship round / matchweek number" },
      { name: "home_team_id", type: "UUID", isForeign: true, foreignTarget: "teams.team_id", isNullable: false, description: "Host team identifier" },
      { name: "away_team_id", type: "UUID", isForeign: true, foreignTarget: "teams.team_id", isNullable: false, description: "Visiting team identifier" },
      { name: "scheduled_at", type: "TIMESTAMPTZ", isNullable: false, description: "Official kickoff calendar date and time" },
      { name: "venue", type: "VARCHAR(120)", isNullable: false, description: "Designated academy pitch" },
      { name: "status", type: "VARCHAR(20)", defaultValue: "'SCHEDULED'", description: "State: SCHEDULED, LIVE, COMPLETED, POSTPONED, CANCELLED" },
      { name: "home_score", type: "SMALLINT", defaultValue: "0", description: "Total goals scored by host team" },
      { name: "away_score", type: "SMALLINT", defaultValue: "0", description: "Total goals scored by visiting team" },
      { name: "home_ht_score", type: "SMALLINT", defaultValue: "0", description: "Half-time host team score" },
      { name: "away_ht_score", type: "SMALLINT", defaultValue: "0", description: "Half-time visiting team score" },
      { name: "match_stage", type: "VARCHAR(40)", defaultValue: "'Regular Season'", description: "Stage: Regular Season, Semi-Final, Final" },
      { name: "referee_name", type: "VARCHAR(80)", isNullable: true, description: "Appointed center referee" },
      { name: "created_at", type: "TIMESTAMPTZ", defaultValue: "NOW()", description: "Scheduling timestamp" },
      { name: "updated_at", type: "TIMESTAMPTZ", defaultValue: "NOW()", description: "Score / result certification timestamp" },
    ],
  },
  {
    tableName: "match_events",
    displayName: "Detailed Match Events & Timeline",
    description: "Granular in-game occurrences: goals, penalties, assists, cautions, and substitutions.",
    category: "Match Operations",
    primaryKey: "event_id",
    fields: [
      { name: "event_id", type: "UUID", isPrimary: true, description: "Unique event incident ID" },
      { name: "match_id", type: "UUID", isForeign: true, foreignTarget: "matches.match_id", isNullable: false, description: "Fixture in which incident occurred" },
      { name: "player_id", type: "UUID", isForeign: true, foreignTarget: "players.player_id", isNullable: false, description: "Primary athlete involved" },
      { name: "team_id", type: "UUID", isForeign: true, foreignTarget: "teams.team_id", isNullable: false, description: "Team attributed to event" },
      { name: "event_type", type: "VARCHAR(30)", isNullable: false, description: "Type: GOAL, PENALTY_GOAL, OWN_GOAL, YELLOW_CARD, RED_CARD, SUB_IN, SUB_OUT" },
      { name: "minute_occurred", type: "SMALLINT", isNullable: false, description: "Standard match minute (1 - 90)" },
      { name: "stoppage_minute", type: "SMALLINT", defaultValue: "0", description: "Additional added injury time minute (e.g. +3)" },
      { name: "assist_player_id", type: "UUID", isForeign: true, foreignTarget: "players.player_id", isNullable: true, description: "Assisting athlete (if goal)" },
      { name: "description", type: "TEXT", isNullable: true, description: "Official referee incident notes" },
      { name: "created_at", type: "TIMESTAMPTZ", defaultValue: "NOW()", description: "Event recording timestamp" },
    ],
  },
  {
    tableName: "standings",
    displayName: "League Standings & Points Table",
    description: "Materialized points table with FIFA win/draw/loss points, goal difference, and form.",
    category: "Analytics",
    primaryKey: "standing_id",
    fields: [
      { name: "standing_id", type: "UUID", isPrimary: true, description: "Unique table entry identifier" },
      { name: "season_id", type: "UUID", isForeign: true, foreignTarget: "seasons.season_id", isNullable: false, description: "Championship season reference" },
      { name: "team_id", type: "UUID", isForeign: true, foreignTarget: "teams.team_id", isNullable: false, description: "Ranked team reference" },
      { name: "rank", type: "INTEGER", isNullable: false, description: "Current league ladder position" },
      { name: "matches_played", type: "INTEGER", defaultValue: "0", description: "Total completed games played" },
      { name: "wins", type: "INTEGER", defaultValue: "0", description: "Victories (3 pts each)" },
      { name: "draws", type: "INTEGER", defaultValue: "0", description: "Draws (1 pt each)" },
      { name: "losses", type: "INTEGER", defaultValue: "0", description: "Defeats (0 pts)" },
      { name: "goals_for", type: "INTEGER", defaultValue: "0", description: "Goals scored across season" },
      { name: "goals_against", type: "INTEGER", defaultValue: "0", description: "Goals conceded" },
      { name: "goal_difference", type: "INTEGER", defaultValue: "0", description: "Calculated GF minus GA" },
      { name: "points", type: "INTEGER", defaultValue: "0", description: "Official championship points (3*W + 1*D)" },
      { name: "form_last_5", type: "VARCHAR(15)", defaultValue: "''", description: "Recent 5 match form array (e.g. W,W,D,L,W)" },
      { name: "clean_sheets", type: "INTEGER", defaultValue: "0", description: "Matches with zero goals conceded" },
      { name: "last_recalculated_at", type: "TIMESTAMPTZ", defaultValue: "NOW()", description: "Timestamp of last report recalculation" },
    ],
  },
  {
    tableName: "users",
    displayName: "User Accounts & Authentication",
    description: "Role-based user management for administrators, match referees, and spectators.",
    category: "Security & System",
    primaryKey: "user_id",
    fields: [
      { name: "user_id", type: "UUID", isPrimary: true, description: "Unique internal user credential key" },
      { name: "full_name", type: "VARCHAR(90)", isNullable: false, description: "Clean display name (e.g. Austin Brian Omondi)" },
      { name: "email", type: "VARCHAR(120)", isUnique: true, isNullable: false, description: "Institutional academy or official email" },
      { name: "password_hash", type: "VARCHAR(255)", isNullable: false, description: "Secure salted Argon2id / bcrypt password digest" },
      { name: "role", type: "VARCHAR(24)", defaultValue: "'spectator'", description: "System Role: admin, referee, spectator, president, records_manager" },
      { name: "session_token", type: "VARCHAR(255)", isNullable: true, description: "Active hashed JWT / session authorization token" },
      { name: "is_active", type: "BOOLEAN", defaultValue: "TRUE", description: "Active account status flag" },
      { name: "last_login_at", type: "TIMESTAMPTZ", isNullable: true, description: "Timestamp of last successful authentication" },
      { name: "created_at", type: "TIMESTAMPTZ", defaultValue: "NOW()", description: "Account provisioning timestamp" },
      { name: "updated_at", type: "TIMESTAMPTZ", defaultValue: "NOW()", description: "Profile modification timestamp" },
    ],
  },
  {
    tableName: "sync_audit_logs",
    displayName: "API Data Pipeline & Sync Audit Logs",
    description: "Audit trail tracking automated web API ingestion, upserts, conflict resolution, and errors.",
    category: "Security & System",
    primaryKey: "log_id",
    fields: [
      { name: "log_id", type: "UUID", isPrimary: true, description: "Unique sync operation ID" },
      { name: "source_api", type: "VARCHAR(80)", isNullable: false, description: "External provider (e.g. Football-Data.org, M-Pesa Inbuilt Webhook)" },
      { name: "sync_type", type: "VARCHAR(40)", isNullable: false, description: "Target: TEAMS, SQUADS, FIXTURES, LIVE_SCORES, FULL_PIPELINE" },
      { name: "status", type: "VARCHAR(20)", defaultValue: "'SUCCESS'", description: "State: SUCCESS, PARTIAL_CONFLICT, FAILED" },
      { name: "records_fetched", type: "INTEGER", defaultValue: "0", description: "Total records received in incoming API payload" },
      { name: "records_upserted", type: "INTEGER", defaultValue: "0", description: "Records inserted or updated without integrity errors" },
      { name: "conflicts_resolved", type: "INTEGER", defaultValue: "0", description: "Duplicate records harmonized via natural keys" },
      { name: "duration_ms", type: "INTEGER", defaultValue: "0", description: "Pipeline runtime latency in milliseconds" },
      { name: "triggered_by", type: "VARCHAR(60)", defaultValue: "'SYSTEM_CRON'", description: "Trigger origin: SYSTEM_CRON or ADMIN_CONSOLE" },
      { name: "created_at", type: "TIMESTAMPTZ", defaultValue: "NOW()", description: "Execution completion timestamp" },
    ],
  },
];

/**
 * Generate full production PostgreSQL / Relational SQL DDL Script
 */
export function generateFullSqlDdlMigration(): string {
  return `-- ====================================================================
-- SPORTS MANAGEMENT PLATFORM • PRODUCTION RELATIONAL DATABASE SCHEMA
-- Complies with FIFA scoring, ACID relational integrity, and strict privacy
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. LEAGUES & TOURNAMENTS TABLE
CREATE TABLE IF NOT EXISTS leagues (
    league_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(120) NOT NULL,
    short_code VARCHAR(10) NOT NULL UNIQUE,
    country VARCHAR(80) NOT NULL DEFAULT 'Kenya',
    division_tier INTEGER NOT NULL DEFAULT 1,
    logo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. SEASONS TABLE
CREATE TABLE IF NOT EXISTS seasons (
    season_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    league_id UUID NOT NULL REFERENCES leagues(league_id) ON DELETE CASCADE,
    season_name VARCHAR(60) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT TRUE,
    points_for_win SMALLINT NOT NULL DEFAULT 3,
    points_for_draw SMALLINT NOT NULL DEFAULT 1,
    points_for_loss SMALLINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_season_name_per_league UNIQUE (league_id, season_name)
);

-- 4. TEAMS & CLUBS TABLE
CREATE TABLE IF NOT EXISTS teams (
    team_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_api_id VARCHAR(64) UNIQUE,
    official_name VARCHAR(100) NOT NULL UNIQUE,
    short_name VARCHAR(12) NOT NULL,
    theme_color VARCHAR(24) NOT NULL DEFAULT '#00ff85',
    logo_url TEXT,
    home_venue VARCHAR(120) NOT NULL,
    founded_year INTEGER NOT NULL DEFAULT 2023,
    manager_name VARCHAR(80) NOT NULL,
    assistant_manager VARCHAR(80),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_teams_external_api_id ON teams(external_api_id);

-- 5. PLAYERS & SQUAD ATHLETES TABLE
CREATE TABLE IF NOT EXISTS players (
    player_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_api_id VARCHAR(64) UNIQUE,
    team_id UUID NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
    full_name VARCHAR(90) NOT NULL,
    position VARCHAR(10) NOT NULL CHECK (position IN ('GK', 'DEF', 'MID', 'FWD')),
    jersey_number SMALLINT NOT NULL CHECK (jersey_number BETWEEN 1 AND 99),
    nationality VARCHAR(60) NOT NULL DEFAULT 'Kenyan',
    birthdate DATE,
    preferred_foot VARCHAR(10) NOT NULL DEFAULT 'Right' CHECK (preferred_foot IN ('Right', 'Left', 'Both')),
    profile_picture_url TEXT,
    is_captain BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_team_jersey_number UNIQUE (team_id, jersey_number)
);
CREATE INDEX IF NOT EXISTS idx_players_team_id ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_players_position ON players(position);

-- 6. MATCHES & FIXTURES TABLE
CREATE TABLE IF NOT EXISTS matches (
    match_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_api_id VARCHAR(64) UNIQUE,
    season_id UUID NOT NULL REFERENCES seasons(season_id) ON DELETE CASCADE,
    matchweek SMALLINT NOT NULL CHECK (matchweek >= 1),
    home_team_id UUID NOT NULL REFERENCES teams(team_id) ON DELETE RESTRICT,
    away_team_id UUID NOT NULL REFERENCES teams(team_id) ON DELETE RESTRICT,
    scheduled_at TIMESTAMPTZ NOT NULL,
    venue VARCHAR(120) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED' 
        CHECK (status IN ('SCHEDULED', 'LIVE', 'COMPLETED', 'POSTPONED', 'CANCELLED')),
    home_score SMALLINT NOT NULL DEFAULT 0 CHECK (home_score >= 0),
    away_score SMALLINT NOT NULL DEFAULT 0 CHECK (away_score >= 0),
    home_ht_score SMALLINT NOT NULL DEFAULT 0 CHECK (home_ht_score >= 0),
    away_ht_score SMALLINT NOT NULL DEFAULT 0 CHECK (away_ht_score >= 0),
    match_stage VARCHAR(40) NOT NULL DEFAULT 'Regular Season',
    referee_name VARCHAR(80),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_different_teams CHECK (home_team_id != away_team_id)
);
CREATE INDEX IF NOT EXISTS idx_matches_season_week ON matches(season_id, matchweek);
CREATE INDEX IF NOT EXISTS idx_matches_teams ON matches(home_team_id, away_team_id);

-- 7. DETAILED MATCH EVENTS TABLE
CREATE TABLE IF NOT EXISTS match_events (
    event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES matches(match_id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(player_id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
    event_type VARCHAR(30) NOT NULL 
        CHECK (event_type IN ('GOAL', 'PENALTY_GOAL', 'OWN_GOAL', 'YELLOW_CARD', 'RED_CARD', 'SUB_IN', 'SUB_OUT')),
    minute_occurred SMALLINT NOT NULL CHECK (minute_occurred BETWEEN 1 AND 120),
    stoppage_minute SMALLINT NOT NULL DEFAULT 0 CHECK (stoppage_minute >= 0),
    assist_player_id UUID REFERENCES players(player_id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_match_events_match_id ON match_events(match_id);
CREATE INDEX IF NOT EXISTS idx_match_events_player_id ON match_events(player_id);

-- 8. LEAGUE STANDINGS TABLE
CREATE TABLE IF NOT EXISTS standings (
    standing_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    season_id UUID NOT NULL REFERENCES seasons(season_id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
    rank INTEGER NOT NULL DEFAULT 1,
    matches_played INTEGER NOT NULL DEFAULT 0,
    wins INTEGER NOT NULL DEFAULT 0,
    draws INTEGER NOT NULL DEFAULT 0,
    losses INTEGER NOT NULL DEFAULT 0,
    goals_for INTEGER NOT NULL DEFAULT 0,
    goals_against INTEGER NOT NULL DEFAULT 0,
    goal_difference INTEGER GENERATED ALWAYS AS (goals_for - goals_against) STORED,
    points INTEGER GENERATED ALWAYS AS (wins * 3 + draws * 1) STORED,
    form_last_5 VARCHAR(15) NOT NULL DEFAULT '',
    clean_sheets INTEGER NOT NULL DEFAULT 0,
    last_recalculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_season_team_standing UNIQUE (season_id, team_id)
);
CREATE INDEX IF NOT EXISTS idx_standings_season_rank ON standings(season_id, rank);

-- 9. USER MANAGEMENT & AUTHENTICATION TABLE
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(90) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(24) NOT NULL DEFAULT 'spectator' 
        CHECK (role IN ('admin', 'referee', 'spectator', 'president', 'records_manager')),
    session_token VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 10. DATA PIPELINE & SYNC AUDIT LOGS
CREATE TABLE IF NOT EXISTS sync_audit_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_api VARCHAR(80) NOT NULL,
    sync_type VARCHAR(40) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
    records_fetched INTEGER NOT NULL DEFAULT 0,
    records_upserted INTEGER NOT NULL DEFAULT 0,
    conflicts_resolved INTEGER NOT NULL DEFAULT 0,
    duration_ms INTEGER NOT NULL DEFAULT 0,
    triggered_by VARCHAR(60) NOT NULL DEFAULT 'SYSTEM_CRON',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sync_audit_created ON sync_audit_logs(created_at DESC);

-- Automated Timestamp Update Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER trg_players_updated_at BEFORE UPDATE ON players FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER trg_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
`;
}
