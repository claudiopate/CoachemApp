-- Aggiorna la tabella profiles per includere l'organization_id
ALTER TABLE profiles ADD COLUMN organization_id TEXT;

-- Aggiorna la tabella bookings per includere l'organization_id
ALTER TABLE bookings ADD COLUMN organization_id TEXT NOT NULL;

-- Aggiorna la tabella progress_records per includere l'organization_id
ALTER TABLE progress_records ADD COLUMN organization_id TEXT NOT NULL;

-- Aggiorna la tabella attendance per includere l'organization_id
ALTER TABLE attendance ADD COLUMN organization_id TEXT NOT NULL;

-- Aggiorna le policy RLS per includere l'organization_id
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view profiles in their organization"
  ON profiles FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM profiles WHERE organization_id = organization_id
  ));

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Coaches can view their bookings" ON bookings;
CREATE POLICY "Users can view bookings in their organization"
  ON bookings FOR SELECT
  USING (organization_id = (
    SELECT organization_id FROM profiles WHERE user_id = auth.uid()
  ));

-- Altre policy simili per le altre tabelle...

