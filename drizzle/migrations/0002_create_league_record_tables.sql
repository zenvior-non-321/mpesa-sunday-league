CREATE TABLE public.teams (id bigint PRIMARY KEY, name text NOT NULL, short_code text NOT NULL DEFAULT '', home_pitch text NOT NULL DEFAULT '', captain text NOT NULL DEFAULT '', active boolean NOT NULL DEFAULT true, updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.teams TO anon, authenticated;
GRANT ALL ON public.teams TO service_role;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read active teams" ON public.teams FOR SELECT TO anon, authenticated USING (active);
CREATE TABLE public.players (id text PRIMARY KEY, team_id bigint NOT NULL REFERENCES public.teams(id), name text NOT NULL, shirt_number integer, position text NOT NULL DEFAULT '', preferred_foot text NOT NULL DEFAULT '', photo_url text NOT NULL DEFAULT '', active boolean NOT NULL DEFAULT true, updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.players TO anon, authenticated;
GRANT ALL ON public.players TO service_role;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read active players" ON public.players FOR SELECT TO anon, authenticated USING (active AND EXISTS (SELECT 1 FROM public.teams t WHERE t.id=team_id AND t.active));
CREATE INDEX players_team_idx ON public.players(team_id);
CREATE UNIQUE INDEX players_one_team_idx ON public.players(lower(btrim(name))) WHERE active;
CREATE TABLE public.player_private_details (player_id text PRIMARY KEY REFERENCES public.players(id), details jsonb NOT NULL DEFAULT '{}');
GRANT ALL ON public.player_private_details TO service_role;
ALTER TABLE public.player_private_details ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.fixtures (id bigint PRIMARY KEY, home_team_id bigint NOT NULL REFERENCES public.teams(id), away_team_id bigint NOT NULL REFERENCES public.teams(id), matchweek integer NOT NULL DEFAULT 1, match_date text NOT NULL DEFAULT '', kickoff_time text NOT NULL DEFAULT '', venue text NOT NULL DEFAULT '', status text NOT NULL DEFAULT 'UPCOMING', active boolean NOT NULL DEFAULT true, updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.fixtures TO anon, authenticated;
GRANT ALL ON public.fixtures TO service_role;
ALTER TABLE public.fixtures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read active fixtures" ON public.fixtures FOR SELECT TO anon, authenticated USING (active);
CREATE TABLE public.match_results (fixture_id bigint PRIMARY KEY REFERENCES public.fixtures(id), home_score integer NOT NULL DEFAULT 0 CHECK (home_score>=0), away_score integer NOT NULL DEFAULT 0 CHECK (away_score>=0), scorers jsonb NOT NULL DEFAULT '""', updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.match_results TO anon, authenticated;
GRANT ALL ON public.match_results TO service_role;
ALTER TABLE public.match_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read active results" ON public.match_results FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.fixtures f WHERE f.id=fixture_id AND f.active));
CREATE TABLE public.player_statistics (id text PRIMARY KEY, team_id bigint NOT NULL REFERENCES public.teams(id), player_name text NOT NULL, goals integer NOT NULL DEFAULT 0, assists integer NOT NULL DEFAULT 0, record jsonb NOT NULL DEFAULT '{}', active boolean NOT NULL DEFAULT true);
GRANT SELECT ON public.player_statistics TO anon, authenticated;
GRANT ALL ON public.player_statistics TO service_role;
ALTER TABLE public.player_statistics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read active statistics" ON public.player_statistics FOR SELECT TO anon, authenticated USING (active);
CREATE TABLE public.league_news (id text PRIMARY KEY, title text NOT NULL DEFAULT '', record jsonb NOT NULL DEFAULT '{}', active boolean NOT NULL DEFAULT true);
GRANT SELECT ON public.league_news TO anon, authenticated;
GRANT ALL ON public.league_news TO service_role;
ALTER TABLE public.league_news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read league news" ON public.league_news FOR SELECT TO anon, authenticated USING (active);
CREATE TABLE public.league_highlights (id text PRIMARY KEY, title text NOT NULL DEFAULT '', record jsonb NOT NULL DEFAULT '{}', active boolean NOT NULL DEFAULT true);
GRANT SELECT ON public.league_highlights TO anon, authenticated;
GRANT ALL ON public.league_highlights TO service_role;
ALTER TABLE public.league_highlights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read league highlights" ON public.league_highlights FOR SELECT TO anon, authenticated USING (active);
CREATE TABLE public.league_injuries (id text PRIMARY KEY, team_id bigint REFERENCES public.teams(id), record jsonb NOT NULL DEFAULT '{}', active boolean NOT NULL DEFAULT true);
GRANT ALL ON public.league_injuries TO service_role;
ALTER TABLE public.league_injuries ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.league_rules (id text PRIMARY KEY, title text NOT NULL DEFAULT '', description text NOT NULL DEFAULT '', record jsonb NOT NULL DEFAULT '{}', active boolean NOT NULL DEFAULT true);
GRANT SELECT ON public.league_rules TO anon, authenticated;
GRANT ALL ON public.league_rules TO service_role;
ALTER TABLE public.league_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read league rules" ON public.league_rules FOR SELECT TO anon, authenticated USING (active);
CREATE TABLE public.league_media (id text PRIMARY KEY, title text NOT NULL DEFAULT '', record jsonb NOT NULL DEFAULT '{}', active boolean NOT NULL DEFAULT true);
GRANT SELECT ON public.league_media TO anon, authenticated;
GRANT ALL ON public.league_media TO service_role;
ALTER TABLE public.league_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read league media" ON public.league_media FOR SELECT TO anon, authenticated USING (active);
CREATE FUNCTION public.sync_league_record_tables() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE t jsonb; p jsonb; m jsonb; r jsonb; pid text; blocked jsonb := NEW.deleted_team_ids;
BEGIN
UPDATE public.teams SET active=false WHERE active;
UPDATE public.players SET active=false WHERE active;
UPDATE public.fixtures SET active=false WHERE active;
UPDATE public.player_statistics SET active=false WHERE active;
UPDATE public.league_news SET active=false WHERE active;
UPDATE public.league_highlights SET active=false WHERE active;
UPDATE public.league_injuries SET active=false WHERE active;
UPDATE public.league_rules SET active=false WHERE active;
UPDATE public.league_media SET active=false WHERE active;
FOR t IN SELECT value FROM jsonb_array_elements(COALESCE(NEW.data->'teams','[]')) LOOP
IF blocked @> jsonb_build_array((t->>'id')::bigint) THEN CONTINUE; END IF;
INSERT INTO public.teams(id,name,short_code,home_pitch,captain) VALUES ((t->>'id')::bigint,t->>'name',COALESCE(t->>'shortCode',''),COALESCE(t->>'homePitch',''),COALESCE(t->>'captain','')) ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,short_code=EXCLUDED.short_code,home_pitch=EXCLUDED.home_pitch,captain=EXCLUDED.captain,active=true,updated_at=now();
FOR p IN SELECT value FROM jsonb_array_elements(COALESCE(t->'squad','[]')) LOOP
pid := (t->>'id') || ':' || lower(btrim(p->>'name'));
INSERT INTO public.players(id,team_id,name,shirt_number,position,preferred_foot,photo_url) VALUES(pid,(t->>'id')::bigint,p->>'name',NULLIF(p->>'number','')::integer,COALESCE(p->>'position',''),COALESCE(p->>'foot',''),COALESCE(p->>'photoUrl','')) ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,shirt_number=EXCLUDED.shirt_number,position=EXCLUDED.position,preferred_foot=EXCLUDED.preferred_foot,photo_url=EXCLUDED.photo_url,active=true,updated_at=now();
INSERT INTO public.player_private_details(player_id,details) VALUES(pid,p-'name'-'number'-'position'-'foot'-'photoUrl') ON CONFLICT(player_id) DO UPDATE SET details=EXCLUDED.details;
END LOOP;
END LOOP;
FOR m IN SELECT value FROM jsonb_array_elements(COALESCE(NEW.data->'matches','[]')) LOOP
IF NOT EXISTS(SELECT 1 FROM public.teams WHERE id=(m->>'homeId')::bigint AND active) OR NOT EXISTS(SELECT 1 FROM public.teams WHERE id=(m->>'awayId')::bigint AND active) THEN CONTINUE; END IF;
INSERT INTO public.fixtures(id,home_team_id,away_team_id,matchweek,match_date,kickoff_time,venue,status) VALUES((m->>'id')::bigint,(m->>'homeId')::bigint,(m->>'awayId')::bigint,COALESCE((m->>'matchweek')::integer,1),COALESCE(m->>'date',''),COALESCE(m->>'time',''),COALESCE(m->>'venue',''),COALESCE(m->>'status','UPCOMING')) ON CONFLICT(id) DO UPDATE SET home_team_id=EXCLUDED.home_team_id,away_team_id=EXCLUDED.away_team_id,matchweek=EXCLUDED.matchweek,match_date=EXCLUDED.match_date,kickoff_time=EXCLUDED.kickoff_time,venue=EXCLUDED.venue,status=EXCLUDED.status,active=true,updated_at=now();
INSERT INTO public.match_results(fixture_id,home_score,away_score,scorers) VALUES((m->>'id')::bigint,COALESCE((m->>'homeScore')::integer,0),COALESCE((m->>'awayScore')::integer,0),COALESCE(m->'scorers','""')) ON CONFLICT(fixture_id) DO UPDATE SET home_score=EXCLUDED.home_score,away_score=EXCLUDED.away_score,scorers=EXCLUDED.scorers,updated_at=now();
END LOOP;
FOR r IN SELECT value FROM jsonb_array_elements(COALESCE(NEW.data->'playerStatsList','[]')) LOOP
IF NOT EXISTS(SELECT 1 FROM public.teams WHERE id=(r->>'teamId')::bigint AND active) THEN CONTINUE; END IF;
INSERT INTO public.player_statistics(id,team_id,player_name,goals,assists,record) VALUES(r->>'id',(r->>'teamId')::bigint,r->>'name',COALESCE((r->>'goals')::integer,0),COALESCE((r->>'assists')::integer,0),r) ON CONFLICT(id) DO UPDATE SET team_id=EXCLUDED.team_id,player_name=EXCLUDED.player_name,goals=EXCLUDED.goals,assists=EXCLUDED.assists,record=EXCLUDED.record,active=true;
END LOOP;
FOR r IN SELECT value FROM jsonb_array_elements(COALESCE(NEW.data->'newsArticles','[]')) LOOP
INSERT INTO public.league_news(id,title,record) VALUES(r->>'id',COALESCE(r->>'title',''),r) ON CONFLICT(id) DO UPDATE SET title=EXCLUDED.title,record=EXCLUDED.record,active=true;
END LOOP;
FOR r IN SELECT value FROM jsonb_array_elements(COALESCE(NEW.data->'highlightVideos','[]')) LOOP
INSERT INTO public.league_highlights(id,title,record) VALUES(r->>'id',COALESCE(r->>'title',''),r) ON CONFLICT(id) DO UPDATE SET title=EXCLUDED.title,record=EXCLUDED.record,active=true;
END LOOP;
FOR r IN SELECT value FROM jsonb_array_elements(COALESCE(NEW.data->'injuryReports','[]')) LOOP
IF NOT EXISTS(SELECT 1 FROM public.teams WHERE id=(r->>'teamId')::bigint AND active) THEN CONTINUE; END IF;
INSERT INTO public.league_injuries(id,team_id,record) VALUES(r->>'id',(r->>'teamId')::bigint,r) ON CONFLICT(id) DO UPDATE SET team_id=EXCLUDED.team_id,record=EXCLUDED.record,active=true;
END LOOP;
FOR r IN SELECT value FROM jsonb_array_elements(COALESCE(NEW.data->'leagueRules','[]')) LOOP
INSERT INTO public.league_rules(id,title,description,record) VALUES(r->>'id',COALESCE(r->>'title',''),COALESCE(r->>'description',''),r) ON CONFLICT(id) DO UPDATE SET title=EXCLUDED.title,description=EXCLUDED.description,record=EXCLUDED.record,active=true;
END LOOP;
FOR r IN SELECT value FROM jsonb_array_elements(COALESCE(NEW.data->'mediaGallery','[]')) LOOP
INSERT INTO public.league_media(id,title,record) VALUES(r->>'id',COALESCE(r->>'title',''),r) ON CONFLICT(id) DO UPDATE SET title=EXCLUDED.title,record=EXCLUDED.record,active=true;
END LOOP;
RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.sync_league_record_tables() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sync_league_record_tables() TO service_role;
CREATE TRIGGER sync_league_records AFTER INSERT OR UPDATE OF data,deleted_team_ids ON public.league_shared_state FOR EACH ROW EXECUTE FUNCTION public.sync_league_record_tables();