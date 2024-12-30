-- Drop existing policies
DROP POLICY IF EXISTS "Users can view messages for their company's EVEs" ON public.eve_messages;
DROP POLICY IF EXISTS "Users can manage messages for their company's EVEs" ON public.eve_messages;

-- Create new policies
CREATE POLICY "Users can view messages for their company's EVEs"
    ON public.eve_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.eves e
            JOIN public.companies c ON e.company_id = c.id
            WHERE (e.id = eve_messages.from_eve_id OR e.id = eve_messages.to_eve_id)
            AND c.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can send messages from their company's EVEs"
    ON public.eve_messages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.eves e
            JOIN public.companies c ON e.company_id = c.id
            WHERE e.id = eve_messages.from_eve_id
            AND c.owner_id = auth.uid()
            AND c.status = 'active'
        )
    );

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_eve_messages_from_eve ON public.eve_messages(from_eve_id);
CREATE INDEX IF NOT EXISTS idx_eve_messages_to_eve ON public.eve_messages(to_eve_id);
CREATE INDEX IF NOT EXISTS idx_eve_messages_created_at ON public.eve_messages(created_at DESC);

-- Add validation trigger
CREATE OR REPLACE FUNCTION validate_eve_message()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate EVE IDs
    IF NOT EXISTS (SELECT 1 FROM eves WHERE id = NEW.from_eve_id) THEN
        RAISE EXCEPTION 'Invalid sender EVE ID';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM eves WHERE id = NEW.to_eve_id) THEN
        RAISE EXCEPTION 'Invalid recipient EVE ID';
    END IF;

    -- Validate message content
    IF NEW.content IS NULL OR LENGTH(TRIM(NEW.content)) = 0 THEN
        RAISE EXCEPTION 'Message content is required';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_eve_message_trigger ON public.eve_messages;
CREATE TRIGGER validate_eve_message_trigger
    BEFORE INSERT OR UPDATE ON public.eve_messages
    FOR EACH ROW
    EXECUTE FUNCTION validate_eve_message();