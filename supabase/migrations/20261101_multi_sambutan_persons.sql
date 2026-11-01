-- ==============================================================================
-- Migration: 20261101_multi_sambutan_persons.sql
-- PP. Jauharul Maknuun - Multi Pemberi Sambutan Refactor
-- Adds multi-location, multi-type, video, social links, credentials & achievements
-- ==============================================================================

-- 1. Add missing columns safely
ALTER TABLE public.sambutan_persons 
  ADD COLUMN IF NOT EXISTS type text DEFAULT 'sambutan',
  ADD COLUMN IF NOT EXISTS quote text,
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS start_date date,
  ADD COLUMN IF NOT EXISTS end_date date,
  ADD COLUMN IF NOT EXISTS credentials text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS achievements text[] DEFAULT '{}'::text[];

-- 2. Populate quote if empty
UPDATE public.sambutan_persons
SET quote = message_short
WHERE quote IS NULL AND message_short IS NOT NULL;

