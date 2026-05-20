CREATE VIEW current_product_price AS
 fix/ui-polish
SELECT

SELECT 
 dev
    p.prodcode,
    p.description,
    p.unit,
    ph.unitprice,
    ph.effdate
FROM product p
 fix/ui-polish
JOIN pricehist ph

JOIN pricehist ph 
 dev
    ON ph.prodcode = p.prodcode
WHERE ph.effdate = (
    SELECT MAX(effdate)
    FROM pricehist
    WHERE prodcode = p.prodcode
 fix/ui-polish
);

)
AND p.record_status = 'ACTIVE';
 dev
