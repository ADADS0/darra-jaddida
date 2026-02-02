-- Make the logostockburse bucket public so logos can be accessed
UPDATE storage.buckets 
SET public = true 
WHERE id = 'logostockburse';

-- Create policy to allow public read access to logos
CREATE POLICY "Public can view logos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'logostockburse');