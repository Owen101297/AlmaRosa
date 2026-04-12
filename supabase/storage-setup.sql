-- =====================================================
-- CONFIGURACIÓN DE SUPABASE STORAGE
-- =====================================================
-- Ejecuta este script en el SQL Editor de Supabase Dashboard
-- https://supabase.com/dashboard/project/pgrnovxaafrhhknsggyy/sql/new
-- =====================================================

-- 1. Crear bucket para imágenes de productos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Política de acceso público (lectura)
DROP POLICY IF EXISTS "product-images public access" ON storage.objects;
CREATE POLICY "product-images public access" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- 3. Política para upload (admin - usar con precaución en producción)
DROP POLICY IF EXISTS "product-images upload" ON storage.objects;
CREATE POLICY "product-images upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' 
  AND (storage.foldername(name))[1] IN ('temp', 'products')
);

-- 4. Política para delete (admin)
DROP POLICY IF EXISTS "product-images delete" ON storage.objects;
CREATE POLICY "product-images delete" ON storage.objects
FOR DELETE USING (bucket_id = 'product-images');