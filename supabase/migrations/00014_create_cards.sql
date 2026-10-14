-- Card templates for postcards, birthdays, and event invitations
CREATE TABLE public.card_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('postcard', 'birthday', 'event', 'thank-you', 'holiday')),
  description TEXT NOT NULL DEFAULT '',
  preview_image TEXT,
  default_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.card_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Card templates are publicly readable" ON public.card_templates FOR SELECT USING (true);

-- User-created cards
CREATE TABLE public.cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES public.card_templates(id),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  sender_name TEXT NOT NULL DEFAULT '',
  recipient_name TEXT,
  event_date DATE,
  event_location TEXT,
  customization JSONB NOT NULL DEFAULT '{}'::jsonb,
  image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_card_slug CHECK (slug ~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$')
);

ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published cards are publicly readable" ON public.cards FOR SELECT USING (is_published = true);
CREATE POLICY "Owners can manage their cards" ON public.cards FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_cards_user ON public.cards (user_id);
CREATE INDEX idx_cards_slug ON public.cards (slug);

-- Seed card templates
INSERT INTO public.card_templates (name, slug, category, description, default_config) VALUES
-- Postcards
('Wanderlust', 'wanderlust', 'postcard', 'Travel-inspired postcard with vintage stamp decoration', '{"colors": {"primary": "#2C3E50", "secondary": "#FDF8F0", "accent": "#E67E22"}, "fonts": {"display": "Playfair Display", "body": "Lato"}}'::jsonb),
('Love Note', 'love-note', 'postcard', 'Romantic love letter with elegant script', '{"colors": {"primary": "#C0392B", "secondary": "#FFF5F5", "accent": "#E8D5D5"}, "fonts": {"display": "Cormorant Garamond", "body": "Quicksand"}}'::jsonb),
('Sunshine', 'sunshine', 'postcard', 'Bright and cheerful with warm sunny vibes', '{"colors": {"primary": "#F39C12", "secondary": "#FFFDF0", "accent": "#E74C3C"}, "fonts": {"display": "Caveat", "body": "Poppins"}}'::jsonb),
-- Birthday
('Confetti Pop', 'confetti-pop', 'birthday', 'Colorful confetti explosion with playful typography', '{"colors": {"primary": "#9B59B6", "secondary": "#FFF0FA", "accent": "#E91E63"}, "fonts": {"display": "Caveat", "body": "Poppins"}}'::jsonb),
('Elegant Age', 'elegant-age', 'birthday', 'Sophisticated milestone birthday with gold accents', '{"colors": {"primary": "#D4AF37", "secondary": "#1A1A2E", "accent": "#F5E6CC"}, "fonts": {"display": "Playfair Display", "body": "Raleway"}}'::jsonb),
('Balloon Party', 'balloon-party', 'birthday', 'Fun balloon illustrations with party vibes', '{"colors": {"primary": "#3498DB", "secondary": "#F0F8FF", "accent": "#E74C3C"}, "fonts": {"display": "Amatic SC", "body": "Nunito"}}'::jsonb),
-- Events
('Garden Party', 'garden-party', 'event', 'Outdoor garden gathering with botanical touches', '{"colors": {"primary": "#27AE60", "secondary": "#F0FFF4", "accent": "#8B6F5C"}, "fonts": {"display": "EB Garamond", "body": "Nunito"}}'::jsonb),
('Cocktail Hour', 'cocktail-hour', 'event', 'Sophisticated evening event with dark elegance', '{"colors": {"primary": "#E8D5A3", "secondary": "#1A1A2E", "accent": "#C5A55A"}, "fonts": {"display": "Bodoni Moda", "body": "Outfit"}}'::jsonb),
('Brunch Club', 'brunch-club', 'event', 'Casual brunch gathering with warm pastels', '{"colors": {"primary": "#E07A5F", "secondary": "#FFF8F0", "accent": "#F2CC8F"}, "fonts": {"display": "Libre Baskerville", "body": "Source Sans 3"}}'::jsonb),
-- Thank You
('Grateful Heart', 'grateful-heart', 'thank-you', 'Heartfelt thank you with elegant simplicity', '{"colors": {"primary": "#B8860B", "secondary": "#FFFFF0", "accent": "#D4A574"}, "fonts": {"display": "Cormorant Garamond", "body": "Lato"}}'::jsonb),
('Warm Thanks', 'warm-thanks', 'thank-you', 'Warm and cozy gratitude card', '{"colors": {"primary": "#C67B5C", "secondary": "#FDF5EF", "accent": "#5C4033"}, "fonts": {"display": "EB Garamond", "body": "Quicksand"}}'::jsonb),
-- Holiday
('Festive Joy', 'festive-joy', 'holiday', 'Christmas and holiday celebration with festive colors', '{"colors": {"primary": "#C0392B", "secondary": "#F5F0E0", "accent": "#27AE60"}, "fonts": {"display": "Playfair Display", "body": "Lato"}}'::jsonb),
('New Year Glow', 'new-year-glow', 'holiday', 'New Year celebration with midnight sparkle', '{"colors": {"primary": "#D4AF37", "secondary": "#0D0D0D", "accent": "#E8E0D0"}, "fonts": {"display": "Sora", "body": "DM Sans"}}'::jsonb);
