-- Create tasks table
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'scheduled', 'in_progress', 'completed', 'failed', 'cancelled')),
    assigned_to UUID NOT NULL REFERENCES public.eves(id),
    created_by UUID NOT NULL REFERENCES public.eves(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    scheduled_for TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    deadline TIMESTAMPTZ,
    dependencies UUID[] DEFAULT '{}',
    result JSONB,
    error TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'
);

-- Add indexes
CREATE INDEX idx_tasks_company ON public.tasks(company_id);
CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_scheduled_for ON public.tasks(scheduled_for);
CREATE INDEX idx_tasks_deadline ON public.tasks(deadline);

-- Add RLS policies
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company's tasks"
    ON public.tasks FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = tasks.company_id
        AND companies.owner_id = auth.uid()
    ));

CREATE POLICY "Users can manage their company's tasks"
    ON public.tasks FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = tasks.company_id
        AND companies.owner_id = auth.uid()
    ));

-- Add updated_at trigger
CREATE TRIGGER handle_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();