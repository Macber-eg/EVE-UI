-- Drop existing policies and start fresh
DROP POLICY IF EXISTS "Users can view their company's EVEs" ON public.eves;
DROP POLICY IF EXISTS "Users can create EVEs" ON public.eves;
DROP POLICY IF EXISTS "Users can update EVEs" ON public.eves;
DROP POLICY IF EXISTS "Users can delete EVEs" ON public.eves;

-- Create simplified but secure policies
CREATE POLICY "Users can view their company's EVEs"
    ON public.eves FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.companies
            WHERE companies.id = eves.company_id
            AND companies.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage EVEs"
    ON public.eves 
    USING (
        EXISTS (
            SELECT 1 FROM public.companies
            WHERE companies.id = eves.company_id
            AND companies.owner_id = auth.uid()
            AND companies.status = 'active'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.companies
            WHERE companies.id = eves.company_id
            AND companies.owner_id = auth.uid()
            AND companies.status = 'active'
        )
    );

-- Add company_id NOT NULL constraint if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'eves' 
        AND column_name = 'company_id' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE public.eves ALTER COLUMN company_id SET NOT NULL;
    END IF;
END $$;

-- Add missing indexes if not exist
CREATE INDEX IF NOT EXISTS idx_eves_company_id ON public.eves(company_id);
CREATE INDEX IF NOT EXISTS idx_eves_status ON public.eves(status);