-- Create EVEs table
CREATE TABLE public.eves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('orchestrator', 'specialist', 'support')),
    status TEXT NOT NULL DEFAULT 'idle' CHECK (status IN ('active', 'busy', 'idle')),
    capabilities TEXT[] NOT NULL DEFAULT '{}',
    parent_id UUID REFERENCES public.eves(id),
    performance JSONB NOT NULL DEFAULT '{
        "efficiency": 0,
        "accuracy": 0,
        "tasks_completed": 0
    }',
    models JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_eves_company ON public.eves(company_id);
CREATE INDEX idx_eves_type ON public.eves(type);
CREATE INDEX idx_eves_status ON public.eves(status);
CREATE INDEX idx_eves_parent ON public.eves(parent_id);

-- Add RLS policies
ALTER TABLE public.eves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company's EVEs"
    ON public.eves FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = eves.company_id
        AND companies.owner_id = auth.uid()
    ));

CREATE POLICY "Users can manage their company's EVEs"
    ON public.eves FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = eves.company_id
        AND companies.owner_id = auth.uid()
    ));

-- Add updated_at trigger
CREATE TRIGGER handle_eves_updated_at
    BEFORE UPDATE ON public.eves
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();