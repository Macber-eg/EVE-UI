/*
  # Create Super Admin User

  1. Changes
    - Creates initial super admin user
    - Sets up admin user record
    - Adds audit log entry
    
  2. Security
    - Uses secure password hashing
    - Sets proper role and permissions
*/

-- Create super admin user
DO $$ 
DECLARE 
    new_user_id UUID;
BEGIN
    -- Create user in auth schema
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        role,
        aud,
        confirmation_token
    ) VALUES (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000000',
        'admin@mavrika.ai',
        crypt('Admin@Password123', gen_salt('bf')),
        NOW(),
        jsonb_build_object(
            'provider', 'email',
            'providers', ARRAY['email']
        ),
        jsonb_build_object(
            'name', 'Super Admin',
            'role', 'super_admin'
        ),
        NOW(),
        NOW(),
        'authenticated',
        'authenticated',
        encode(gen_random_bytes(32), 'hex')
    )
    RETURNING id INTO new_user_id;

    -- Create admin user record
    INSERT INTO public.admin_users (
        id,
        user_id,
        role,
        permissions,
        status
    ) VALUES (
        gen_random_uuid(),
        new_user_id,
        'super_admin',
        '["*"]'::jsonb,
        'active'
    );

    -- Add audit log entry
    INSERT INTO public.admin_audit_logs (
        id,
        admin_id,
        action,
        entity_type,
        entity_id,
        changes
    )
    SELECT
        gen_random_uuid(),
        au.id,
        'create_super_admin',
        'admin_users',
        au.id,
        '{"initial_setup": true}'::jsonb
    FROM public.admin_users au
    WHERE au.user_id = new_user_id;

END $$;