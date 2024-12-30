-- Create notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('eve', 'performance', 'system')),
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb,
    CONSTRAINT notifications_company_fk FOREIGN KEY (company_id)
        REFERENCES public.companies(id) ON DELETE CASCADE
);

-- Add indexes
CREATE INDEX idx_notifications_company ON public.notifications(company_id);
CREATE INDEX idx_notifications_type ON public.notifications(type);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- Add RLS policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company's notifications"
    ON public.notifications FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = notifications.company_id
        AND companies.owner_id = auth.uid()
    ));

CREATE POLICY "Users can update their company's notifications"
    ON public.notifications FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = notifications.company_id
        AND companies.owner_id = auth.uid()
    ));

-- Add trigger for new EVE creation notification
CREATE OR REPLACE FUNCTION notify_eve_creation()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (company_id, title, description, type, metadata)
    VALUES (
        NEW.company_id,
        'New EVE™ Created',
        format('EVE™ %s has been created as %s', NEW.name, NEW.role),
        'eve',
        jsonb_build_object('eve_id', NEW.id)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER eve_creation_notification
    AFTER INSERT ON public.eves
    FOR EACH ROW
    EXECUTE FUNCTION notify_eve_creation();