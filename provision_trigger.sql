CREATE OR REPLACE FUNCTION public.provision_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."UserModule_Rights" (user_id, module_code, has_access)
  VALUES 
    (NEW.id, 'PRD_ADD', 1),
    (NEW.id, 'PRD_EDIT', 1),
    (NEW.id, 'PRD_DEL', 0);
    
  RETURN NEW; -- ITO ANG KULANG! Importante ito para matapos ang registration.
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Huwag kalimutan ikabit ang trigger!
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.provision_new_user();

-- FINAL VERIFIED VERSION