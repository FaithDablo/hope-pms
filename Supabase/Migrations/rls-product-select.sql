-- Enable RLS
ALTER TABLE product ENABLE ROW LEVEL SECURITY;

-- SELECT policy for USER / ADMIN / SUPERADMIN
CREATE POLICY "product_select_policy"
ON product
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM "user" u
        WHERE u.userid = auth.uid()::text
        AND (
            (u.user_type = 'USER' AND product.record_status = 'ACTIVE')
            OR
            (u.user_type IN ('ADMIN', 'SUPERADMIN'))
        )
    )
);

