-- Drop existing policies first
DROP POLICY IF EXISTS "Users can manage their own companies" ON public.companies;
DROP POLICY IF EXISTS "Users can manage their company's EVEs" ON public.eves;
DROP POLICY IF EXISTS "Users can manage their company's tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can manage their company's messages" ON public.eve_messages;
DROP POLICY IF EXISTS "Users can manage their company's subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can manage their company's API keys" ON public.company_api_keys;
DROP POLICY IF EXISTS "Users can manage their company's notifications" ON public.notifications;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create or replace all tables
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('corporation', 'llc', 'nonprofit')),
    jurisdiction TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused', 'terminated')),
    owner_id UUID NOT NULL REFERENCES auth.users(id),
    contact JSONB NOT NULL DEFAULT '{}',
    settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(owner_id, name)
);

CREATE TABLE IF NOT EXISTS public.eves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('orchestrator', 'specialist', 'support')),
    status TEXT NOT NULL DEFAULT 'idle' CHECK (status IN ('active', 'busy', 'idle')),
    capabilities TEXT[] NOT NULL DEFAULT '{}',
    parent_id UUID REFERENCES public.eves(id),
    performance JSONB NOT NULL DEFAULT '{"efficiency": 0, "accuracy": 0, "tasks_completed": 0}',
    models JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
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

CREATE TABLE IF NOT EXISTS public.eve_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_eve_id UUID NOT NULL REFERENCES public.eves(id),
    to_eve_id UUID NOT NULL REFERENCES public.eves(id),
    content TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('direct', 'broadcast', 'task', 'status_update')),
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT NOT NULL CHECK (status IN ('sent', 'delivered', 'read', 'processed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    processed_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    stripe_customer_id TEXT NOT NULL,
    stripe_subscription_id TEXT NOT NULL,
    tier TEXT NOT NULL CHECK (tier IN ('starter', 'growth', 'enterprise')),
    status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
    trial_end TIMESTAMPTZ,
    features JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id)
);

CREATE TABLE IF NOT EXISTS public.company_api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    encrypted_key TEXT NOT NULL,
    use_mavrika_key BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'active',
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, provider)
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('eve', 'performance', 'system')),
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);

-- Enable RLS on all tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eve_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create new RLS policies with unique names
CREATE POLICY "companies_owner_access" ON public.companies
    USING (owner_id = auth.uid());

CREATE POLICY "eves_company_access" ON public.eves
    USING (EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = eves.company_id
        AND companies.owner_id = auth.uid()
    ));

CREATE POLICY "tasks_company_access" ON public.tasks
    USING (EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = tasks.company_id
        AND companies.owner_id = auth.uid()
    ));

CREATE POLICY "messages_company_access" ON public.eve_messages
    USING (EXISTS (
        SELECT 1 FROM public.eves e
        JOIN public.companies c ON e.company_id = c.id
        WHERE (e.id = eve_messages.from_eve_id OR e.id = eve_messages.to_eve_id)
        AND c.owner_id = auth.uid()
    ));

CREATE POLICY "subscriptions_company_access" ON public.subscriptions
    USING (EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = subscriptions.company_id
        AND companies.owner_id = auth.uid()
    ));

CREATE POLICY "api_keys_company_access" ON public.company_api_keys
    USING (EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = company_api_keys.company_id
        AND companies.owner_id = auth.uid()
    ));

CREATE POLICY "notifications_company_access" ON public.notifications
    USING (EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = notifications.company_id
        AND companies.owner_id = auth.uid()
    ));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_companies_owner ON public.companies(owner_id);
CREATE INDEX IF NOT EXISTS idx_companies_status ON public.companies(status);
CREATE INDEX IF NOT EXISTS idx_eves_company ON public.eves(company_id);
CREATE INDEX IF NOT EXISTS idx_eves_status ON public.eves(status);
CREATE INDEX IF NOT EXISTS idx_tasks_company ON public.tasks(company_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_eve_messages_from ON public.eve_messages(from_eve_id);
CREATE INDEX IF NOT EXISTS idx_eve_messages_to ON public.eve_messages(to_eve_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_company ON public.subscriptions(company_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_company ON public.company_api_keys(company_id);
CREATE INDEX IF NOT EXISTS idx_notifications_company ON public.notifications(company_id);