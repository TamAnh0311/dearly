CREATE TABLE public.cute_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  question TEXT NOT NULL DEFAULT 'Will you be my girlfriend?',
  sender_name TEXT NOT NULL DEFAULT '',
  recipient_name TEXT,
  theme TEXT NOT NULL DEFAULT 'hearts' CHECK (theme IN ('hearts', 'roses', 'stars', 'kawaii', 'classic')),
  yes_message TEXT NOT NULL DEFAULT 'I knew you would say yes! 💕',
  background_color TEXT NOT NULL DEFAULT '#FFF0F5',
  accent_color TEXT NOT NULL DEFAULT '#FF69B4',
  answered BOOLEAN NOT NULL DEFAULT false,
  answered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_question_slug CHECK (slug ~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$')
);

ALTER TABLE public.cute_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read cute questions" ON public.cute_questions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create cute questions" ON public.cute_questions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can manage their questions" ON public.cute_questions FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_cute_questions_slug ON public.cute_questions (slug);
CREATE INDEX idx_cute_questions_user ON public.cute_questions (user_id);
