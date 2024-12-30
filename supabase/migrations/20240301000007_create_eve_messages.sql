-- Create EVE messages table
CREATE TABLE public.eve_messages (
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
    metadata JSONB DEFAULT '{}',
    CONSTRAINT valid_delivery_time CHECK (delivered_at IS NULL OR delivered_at >= created_at),
    CONSTRAINT valid_read_time CHECK (read_at IS NULL OR read_at >= delivered_at),
    CONSTRAINT valid_processed_time CHECK (processed_at IS NULL OR processed_at >= read_at)
);

-- Add indexes
CREATE INDEX idx_eve_messages_from_eve ON public.eve_messages(from_eve_id);
CREATE INDEX idx_eve_messages_to_eve ON public.eve_messages(to_eve_id);
CREATE INDEX idx_eve_messages_status ON public.eve_messages(status);
CREATE INDEX idx_eve_messages_created_at ON public.eve_messages(created_at DESC);
CREATE INDEX idx_eve_messages_type ON public.eve_messages(type);

-- Add RLS policies
ALTER TABLE public.eve_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages for their company's EVEs"
    ON public.eve_messages FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.eves e
        JOIN public.companies c ON e.company_id = c.id
        WHERE (e.id = eve_messages.from_eve_id OR e.id = eve_messages.to_eve_id)
        AND c.owner_id = auth.uid()
    ));

CREATE POLICY "Users can manage messages for their company's EVEs"
    ON public.eve_messages FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.eves e
        JOIN public.companies c ON e.company_id = c.id
        WHERE (e.id = eve_messages.from_eve_id OR e.id = eve_messages.to_eve_id)
        AND c.owner_id = auth.uid()
    ));

-- Add updated_at trigger
CREATE TRIGGER handle_eve_messages_updated_at
    BEFORE UPDATE ON public.eve_messages
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();