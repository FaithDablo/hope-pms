-- INSERT policy for ADMIN / SUPERADMIN
CREATE POLICY "product_insert_policy"
ON product
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM "user" u
        WHERE u.userid = auth.uid()::text
        AND u.user_type IN ('ADMIN', 'SUPERADMIN')
    )
);

-- UPDATE policy for ADMIN / SUPERADMIN
CREATE POLICY "product_update_policy"
ON product
FOR UPDATE
USING (
    EXISTS (
        SELECT 1
        FROM "user" u
        WHERE u.userid = auth.uid()::text
        AND u.user_type IN ('ADMIN', 'SUPERADMIN')
    )
);

-- DELETE policy for SUPERADMIN only
CREATE POLICY "product_delete_policy"
ON product
FOR DELETE
USING (
    EXISTS (
        SELECT 1
        FROM "user" u
        WHERE u.userid = auth.uid()::text
        AND u.user_type = 'SUPERADMIN'
    )
);

