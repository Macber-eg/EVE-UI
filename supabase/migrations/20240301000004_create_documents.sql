-- Create documents table with vector support
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id),
    content TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}',
    embedding vector(1536),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_documents_company ON public.documents(company_id);
CREATE INDEX idx_documents_embedding ON public.documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Add RLS policies
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company's documents"
    ON public.documents FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = documents.company_id
        AND companies.owner_id = auth.uid()
    ));

CREATE POLICY "Users can manage their company's documents"
    ON public.documents FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = documents.company_id
        AND companies.owner_id = auth.uid()
    ));

-- Add updated_at trigger
CREATE TRIGGER handle_documents_updated_at
    BEFORE UPDATE ON public.documents
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();