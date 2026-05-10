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