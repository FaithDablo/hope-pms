CREATE VIEW current_product_price AS
SELECT
    p.prodcode,
    p.description,
    p.unit,
    ph.unitprice,
    ph.effdate
FROM product p
JOIN pricehist ph
    ON ph.prodcode = p.prodcode
WHERE ph.effdate = (
    SELECT MAX(effdate)
    FROM pricehist
    WHERE prodcode = p.prodcode
);