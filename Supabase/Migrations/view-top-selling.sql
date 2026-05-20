CREATE OR REPLACE VIEW top_selling_products AS
SELECT
  p.prodcode,
  p.description,
  SUM(sd.quantity) AS totalqty
FROM product p
JOIN salesdetail sd
  ON sd.prodcode = p.prodcode
WHERE p.record_status = 'ACTIVE'
GROUP BY p.prodcode, p.description
ORDER BY totalqty DESC
LIMIT 10;