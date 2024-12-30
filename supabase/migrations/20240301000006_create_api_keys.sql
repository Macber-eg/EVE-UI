-- Create API keys table
CREATE TABLE public.company_api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id),
    provider TEXT NOT NULL,
    encrypted_key TEXT NOT NULL,
    use_mavrika_key BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'active',
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, provider)
);

-- Add indexes
CREATE INDEX idx_company_api_keys_company ON public.company_api_keys(company_id);
CREATE INDEX idx_company_api_keys_provider ON public.company_api_keys(provider);
CREATE INDEX idx_company_api_keys_status ON public.company_api_keys(status);

-- Add RLS policies
ALTER TABLE public.company_api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company's API keys"
    ON public.company_api_keys FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = company_api_keys.company_id
        AND companies.owner_id = auth.uid()
    ));

CREATE POLICY "Users can manage their company's API keys"
    ON public.company_api_keys FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = company_api_keys.company_id
        AND companies.owner_id = auth.uid()
    ));

-- Add updated_at trigger
CREATE TRIGGER handle_company_api_keys_updated_at
    BEFORE UPDATE ON public.company_api_keys
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();