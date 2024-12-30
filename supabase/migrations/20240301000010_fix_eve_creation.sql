-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can view their company's EVEs" ON public.eves;
DROP POLICY IF EXISTS "Users can insert EVEs" ON public.eves;
DROP POLICY IF EXISTS "Users can update their company's EVEs" ON public.eves;
DROP POLICY IF EXISTS "Users can delete their company's EVEs" ON public.eves;

-- Create new RLS policies with proper checks
CREATE POLICY "Users can view their company's EVEs"
    ON public.eves FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.companies
            WHERE companies.id = eves.company_id
            AND companies.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can create EVEs"
    ON public.eves FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.companies
            WHERE companies.id = eves.company_id
            AND companies.owner_id = auth.uid()
            AND companies.status = 'active'
        )
    );

CREATE POLICY "Users can update EVEs"
    ON public.eves FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.companies
            WHERE companies.id = eves.company_id
            AND companies.owner_id = auth.uid()
            AND companies.status = 'active'
        )
    );

CREATE POLICY "Users can delete EVEs"
    ON public.eves FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.companies
            WHERE companies.id = eves.company_id
            AND companies.owner_id = auth.uid()
            AND companies.status = 'active'
        )
    );

-- Add trigger to validate EVE data
CREATE OR REPLACE FUNCTION validate_eve_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate required fields
    IF NEW.name IS NULL OR LENGTH(TRIM(NEW.name)) = 0 THEN
        RAISE EXCEPTION 'EVE name is required';
    END IF;

    IF NEW.role IS NULL OR LENGTH(TRIM(NEW.role)) = 0 THEN
        RAISE EXCEPTION 'EVE role is required';
    END IF;

    -- Validate type
    IF NEW.type NOT IN ('orchestrator', 'specialist', 'support') THEN
        RAISE EXCEPTION 'Invalid EVE type';
    END IF;

    -- Validate status
    IF NEW.status NOT IN ('active', 'busy', 'idle') THEN
        RAISE EXCEPTION 'Invalid EVE status';
    END IF;

    -- Ensure company exists
    IF NOT EXISTS (
        SELECT 1 FROM companies 
        WHERE id = NEW.company_id 
        AND status = 'active'
    ) THEN
        RAISE EXCEPTION 'Company not found or inactive';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS validate_eve_data_trigger ON public.eves;
CREATE TRIGGER validate_eve_data_trigger
    BEFORE INSERT OR UPDATE ON public.eves
    FOR EACH ROW
    EXECUTE FUNCTION validate_eve_data();