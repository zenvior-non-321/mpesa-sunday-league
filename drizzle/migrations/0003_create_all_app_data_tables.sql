CREATE TABLE public.app_data_store (
  key text PRIMARY KEY,
  access_class text NOT NULL DEFAULT 'managed',
  data jsonb NOT NULL DEFAULT 'null'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.app_data_store TO anon, authenticated;
GRANT ALL ON public.app_data_store TO service_role;
ALTER TABLE public.app_data_store ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read public app data" ON public.app_data_store FOR SELECT TO anon, authenticated
  USING (access_class IN ('managed','community'));

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['fantasy_ratings','fantasy_challenges','fantasy_squads','community_comments','mvp_votes','mvp_winners','match_reports','match_sheets','calendar_activities','playlists','league_seasons','league_referees','league_decrees','league_broadcasts','league_standings_records','league_finances','board_registry','voter_verifications','club_applications','tryout_requests','league_inquiries','email_dispatches','other_league_records']
  LOOP
    EXECUTE format('CREATE TABLE public.%I (row_key text PRIMARY KEY, store_key text NOT NULL, record jsonb NOT NULL DEFAULT ''{}''::jsonb, updated_at timestamptz NOT NULL DEFAULT now())', t);
    EXECUTE format('CREATE INDEX ON public.%I (store_key)', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    IF t NOT IN ('league_finances','board_registry','voter_verifications','club_applications','tryout_requests','league_inquiries','email_dispatches') THEN
      EXECUTE format('GRANT SELECT ON public.%I TO anon, authenticated', t);
      EXECUTE format('CREATE POLICY "Public read" ON public.%I FOR SELECT TO anon, authenticated USING (true)', t);
    END IF;
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public.mirror_app_data_store()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE target text; k text; items jsonb;
BEGIN
  k := COALESCE(NEW.key, OLD.key);
  target := CASE
    WHEN k LIKE 'mpesa_fantasy_admin_ratings%' THEN 'fantasy_ratings'
    WHEN k LIKE 'mpesa_fantasy_gw_challenges%' OR k LIKE 'mpesa_fantasy_locked%' THEN 'fantasy_challenges'
    WHEN k LIKE '%mpesa_fantasy_squad%' THEN 'fantasy_squads'
    WHEN k LIKE 'mpesa_pes_comments%' THEN 'community_comments'
    WHEN k LIKE 'mpesa_pes_mvp_votes%' THEN 'mvp_votes'
    WHEN k LIKE 'mpesa_pes_mvp_winners%' THEN 'mvp_winners'
    WHEN k LIKE 'mpesa_pes_matchreports%' OR k LIKE '%mpesa_match_report_form%' THEN 'match_reports'
    WHEN k LIKE 'mpesa_pes_matchsheet%' THEN 'match_sheets'
    WHEN k LIKE 'mpesa_pes_calendar%' THEN 'calendar_activities'
    WHEN k LIKE 'mpesa_pes_playlist%' THEN 'playlists'
    WHEN k LIKE 'mpesa_pes_seasons%' THEN 'league_seasons'
    WHEN k LIKE 'mpesa_pes_referees%' THEN 'league_referees'
    WHEN k LIKE 'mpesa_pes_decrees%' THEN 'league_decrees'
    WHEN k LIKE 'mpesa_pes_broadcasts%' THEN 'league_broadcasts'
    WHEN k LIKE 'mpesa_pes_standings%' OR k LIKE 'mpesa_pes_stats%' THEN 'league_standings_records'
    WHEN k LIKE 'mpesa_pes_finances%' THEN 'league_finances'
    WHEN k LIKE 'mpesa_pes_registered_board%' OR k LIKE 'mpesa_board_access%' THEN 'board_registry'
    WHEN k LIKE 'mpesa_pes_registered_school%' OR k LIKE 'mpesa_pes_pending_verif%' OR k LIKE 'mpesa_pes_voted_emails%' THEN 'voter_verifications'
    WHEN k LIKE 'mpesa_pes_club_applications%' THEN 'club_applications'
    WHEN k LIKE 'mpesa_pes_tryout%' THEN 'tryout_requests'
    WHEN k LIKE 'mpesa_pes_inquiries%' THEN 'league_inquiries'
    WHEN k LIKE 'mpesa_pes_email_dispatches%' THEN 'email_dispatches'
    ELSE 'other_league_records' END;
  EXECUTE format('DELETE FROM public.%I WHERE store_key = $1', target) USING k;
  IF TG_OP <> 'DELETE' THEN
    items := NEW.data;
    IF jsonb_typeof(items) = 'array' THEN
      EXECUTE format('INSERT INTO public.%I (row_key, store_key, record) SELECT $1 || '':'' || (ord - 1), $1, e FROM jsonb_array_elements($2) WITH ORDINALITY AS x(e, ord) ON CONFLICT (row_key) DO UPDATE SET record = EXCLUDED.record, updated_at = now()', target) USING k, items;
    ELSIF jsonb_typeof(items) = 'object' THEN
      EXECUTE format('INSERT INTO public.%I (row_key, store_key, record) SELECT $1 || '':'' || e.key, $1, jsonb_build_object(''key'', e.key, ''value'', e.value) FROM jsonb_each($2) e ON CONFLICT (row_key) DO UPDATE SET record = EXCLUDED.record, updated_at = now()', target) USING k, items;
    ELSE
      EXECUTE format('INSERT INTO public.%I (row_key, store_key, record) VALUES ($1, $1, jsonb_build_object(''value'', $2)) ON CONFLICT (row_key) DO UPDATE SET record = EXCLUDED.record, updated_at = now()', target) USING k, items;
    END IF;
  END IF;
  RETURN NULL;
END $$;

CREATE TRIGGER mirror_app_data_store_trg AFTER INSERT OR UPDATE OR DELETE ON public.app_data_store
FOR EACH ROW EXECUTE FUNCTION public.mirror_app_data_store();