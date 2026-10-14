CREATE TABLE public.site_song (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  youtube_id text,
  youtube_url text,
  title text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_song TO anon, authenticated;
GRANT ALL ON public.site_song TO service_role;
ALTER TABLE public.site_song ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read the site song" ON public.site_song FOR SELECT TO anon, authenticated USING (true);
INSERT INTO public.site_song (id) VALUES (1);