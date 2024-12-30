-- Create companies table
CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('corporation', 'llc', 'nonprofit')),
    jurisdiction TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused', 'terminated')),
    owner_id UUID NOT NULL,
    contact JSONB NOT NULL DEFAULT '{}',
    settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(owner_id, name)
);

-- Add indexes
CREATE INDEX idx_companies_owner ON public.companies(owner_id);
CREATE INDEX idx_companies_status ON public.companies(status);
CREATE INDEX idx_companies_name ON public.companies(name);

-- Add RLS policies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own companies"
    ON public.companies FOR SELECT
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own companies"
    ON public.companies FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own companies"
    ON public.companies FOR UPDATE
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own companies"
    ON public.companies FOR DELETE
    USING (auth.uid() = owner_id);

-- Add updated_at trigger
CREATE TRIGGER handle_companies_updated_at
    BEFORE UPDATE ON public.companies
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();