-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their company's EVEs" ON public.eves;
DROP POLICY IF EXISTS "Users can manage their company's EVEs" ON public.eves;

-- Create new policies
CREATE POLICY "Users can view their company's EVEs"
    ON public.eves FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.companies
            WHERE companies.id = eves.company_id
            AND companies.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert EVEs"
    ON public.eves FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.companies
            WHERE companies.id = eves.company_id
            AND companies.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their company's EVEs"
    ON public.eves FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.companies
            WHERE companies.id = eves.company_id
            AND companies.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their company's EVEs"
    ON public.eves FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.companies
            WHERE companies.id = eves.company_id
            AND companies.owner_id = auth.uid()
        )
    );