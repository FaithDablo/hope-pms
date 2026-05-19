ALTER TABLE public."user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usermodule_rights ENABLE ROW LEVEL SECURITY;

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