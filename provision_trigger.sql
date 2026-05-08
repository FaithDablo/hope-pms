CREATE OR REPLACE FUNCTION public.provision_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."UserModule_Rights" ("userId", module_code, has_access)
  VALUES 
    (NEW.id, 'PRD_ADD', 1),
    (NEW.id, 'PRD_EDIT', 1),
    (NEW.id, 'PRD_DEL', 0),
    (NEW.id, 'ADM_MOD', 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;