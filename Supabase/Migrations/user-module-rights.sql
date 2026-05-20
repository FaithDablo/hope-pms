-- USER TABLE
CREATE TABLE "user" (
  userid VARCHAR(20) PRIMARY KEY,
  username VARCHAR(50),
  firstname VARCHAR(50),
  lastname VARCHAR(50),
  user_type VARCHAR(20),
  record_status VARCHAR(10),
  stamp VARCHAR(60)
);


-- MODULE TABLE
CREATE TABLE module (
  module_id VARCHAR(20) PRIMARY KEY,
  module_name VARCHAR(50)
);


-- RIGHTS TABLE
CREATE TABLE rights (
  right_id VARCHAR(20) PRIMARY KEY,
  right_name VARCHAR(50)
);


-- USER_MODULE TABLE
CREATE TABLE user_module (
  userid VARCHAR(20),
  module_id VARCHAR(20),
  rights_value INT,
  record_status VARCHAR(10),
  stamp VARCHAR(60)
);


-- USER MODULE RIGHTS TABLE
CREATE TABLE UserModule_Rights (
  userid VARCHAR(20),
  right_id VARCHAR(20),
  right_value INT,
  record_status VARCHAR(10),
  stamp VARCHAR(60)
);




ALTER TABLE public."user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usermodule_rights ENABLE ROW LEVEL SECURITY;


DROP POLICY IF EXISTS admin_update_user_status_only ON public."user";
DROP POLICY IF EXISTS protect_superadmin_rights ON public.usermodule_rights;


CREATE POLICY admin_update_user_status_only
ON public."user"
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public."user" current_user_row
    WHERE current_user_row.userid = auth.uid()::text
    AND current_user_row.user_type IN ('ADMIN', 'SUPERADMIN')
  )
  AND user_type != 'SUPERADMIN'
)
WITH CHECK (
  user_type != 'SUPERADMIN'
);


CREATE POLICY protect_superadmin_rights
ON public.usermodule_rights
FOR ALL
TO authenticated
USING (
  userid NOT IN (
    SELECT userid
    FROM public."user"
    WHERE user_type = 'SUPERADMIN'
  )
)
WITH CHECK (
  userid NOT IN (
    SELECT userid
    FROM public."user"
    WHERE user_type = 'SUPERADMIN'
  )
);


UPDATE public."user"
SET user_type = 'SUPERADMIN',
    record_status = 'ACTIVE'
WHERE username = 'jcesperanza@neu.edu.ph';


UPDATE public."user"
SET user_type = 'ADMIN',
    record_status = 'ACTIVE'
WHERE username IN (
  'ashleydennise.alberto@neu.edu.ph',
  'faith.dablo@neu.edu.ph',
  'princess.pulgo@neu.edu.ph'
);


UPDATE public."user"
SET user_type = 'USER'
WHERE username NOT IN (
  'jcesperanza@neu.edu.ph',
  'ashleydennise.alberto@neu.edu.ph',
  'faith.dablo@neu.edu.ph',
  'princess.pulgo@neu.edu.ph'
);