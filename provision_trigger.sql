/**
 * PR-04: Automated User Provisioning Control Flow
 * Feature: System Security Gating & Default Rights Provisioning
 * Target: Automates base module assignment whenever a new authentication profile is verified.
 */

-- 1. Create or overwrite the functional provisioning trigger logic
CREATE OR REPLACE FUNCTION public.provision_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER -- Runs with elevated administrative privileges to bypass base table RLS configurations
AS $$
BEGIN
  -- Inject fallback system permissions mapped directly to the newly registered identifier
  INSERT INTO public."UserModule_Rights" ("userId", "module_code", "has_access")
  VALUES 
    (NEW.id, 'PRD_ADD', 1),   -- Grants product creation access by default
    (NEW.id, 'PRD_EDIT', 1),  -- Grants product modification access by default
    (NEW.id, 'PRD_DEL', 0);   -- Restricts destructive deletion rights by default

  RETURN NEW;
END;
$$;

-- 2. Bind the operational trigger to the public profiles dependency layer
-- Note: Drop statement handles potential schema migration re-runs gracefully.
DROP TRIGGER IF EXISTS on_auth_user_created ON public.profiles;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.provision_new_user();
