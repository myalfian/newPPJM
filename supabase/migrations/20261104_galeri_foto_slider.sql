-- =============================================================================
-- Galeri Foto 3-Photo Slider Schema & Partial Index Optimization
-- =============================================================================

ALTER TABLE public.galeri_foto
  ADD COLUMN IF NOT EXISTS photos jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS event_date text;

CREATE INDEX IF NOT EXISTS idx_galeri_foto_active_order
  ON public.galeri_foto (order_index ASC, created_at DESC)
  WHERE is_active = true;

