-- SUPERADMIN USER
INSERT INTO "user" VALUES (
  'U001',
  'superadmin',
  'Super',
  'Admin',
  'SUPERADMIN',
  'ACTIVE',
  '2026-01-01'
);


-- MODULES
INSERT INTO module VALUES ('M001','Products');
INSERT INTO module VALUES ('M002','Sales');
INSERT INTO module VALUES ('M003','Users');


-- RIGHTS
INSERT INTO rights VALUES ('R001','CREATE');
INSERT INTO rights VALUES ('R002','READ');
INSERT INTO rights VALUES ('R003','UPDATE');
INSERT INTO rights VALUES ('R004','DELETE');


-- USER MODULE ACCESS (FULL ACCESS = 1)
INSERT INTO user_module VALUES ('U001','M001',1,'ACTIVE','2026');
INSERT INTO user_module VALUES ('U001','M002',1,'ACTIVE','2026');
INSERT INTO user_module VALUES ('U001','M003',1,'ACTIVE','2026');


-- USER RIGHTS (ALL PERMISSIONS)
INSERT INTO usermodule_rights VALUES ('U001','R001',1,'ACTIVE','2026');
INSERT INTO usermodule_rights VALUES ('U001','R002',1,'ACTIVE','2026');
INSERT INTO usermodule_rights VALUES ('U001','R003',1,'ACTIVE','2026');
INSERT INTO usermodule_rights VALUES ('U001','R004',1,'ACTIVE','2026');


UPDATE "user"
SET username = 'jcesperanza@neu.edu.ph'
WHERE userid = 'U001';


-- Keep U001 as the only SUPERADMIN account
UPDATE public."user"
SET username = 'jcesperanza@neu.edu.ph',
    firstname = 'Super',
    lastname = 'Admin',
    user_type = 'SUPERADMIN',
    record_status = 'ACTIVE'
WHERE userid = 'U001';


-- Make groupmates ADMIN
UPDATE public."user"
SET user_type = 'ADMIN',
    record_status = 'ACTIVE'
WHERE username IN (
  'ashleydennise.alberto@neu.edu.ph',
  'faith.dablo@neu.edu.ph',
  'princess.pulgo@neu.edu.ph'
);


-- Make everyone else USER except the official SUPERADMIN and admins
UPDATE public."user"
SET user_type = 'USER'
WHERE username NOT IN (
  'jcesperanza@neu.edu.ph',
  'ashleydennise.alberto@neu.edu.ph',
  'faith.dablo@neu.edu.ph',
  'princess.pulgo@neu.edu.ph'
);


-- Insert modules only if missing
INSERT INTO public.module VALUES ('M001','Products')
ON CONFLICT (module_id) DO NOTHING;


INSERT INTO public.module VALUES ('M002','Sales')
ON CONFLICT (module_id) DO NOTHING;


INSERT INTO public.module VALUES ('M003','Users')
ON CONFLICT (module_id) DO NOTHING;


-- Insert rights only if missing
INSERT INTO public.rights VALUES ('R001','CREATE')
ON CONFLICT (right_id) DO NOTHING;


INSERT INTO public.rights VALUES ('R002','READ')
ON CONFLICT (right_id) DO NOTHING;


INSERT INTO public.rights VALUES ('R003','UPDATE')
ON CONFLICT (right_id) DO NOTHING;


INSERT INTO public.rights VALUES ('R004','DELETE')
ON CONFLICT (right_id) DO NOTHING;


SELECT userid, username, user_type, record_status
FROM public."user"
ORDER BY user_type, username;

