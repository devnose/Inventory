const sql = require("mssql"); // Assuming you are using the mssql library

async function mapValues(ordNo, invNo, pool,sql, clonedInvoiceObject) {
  console.log(invNo)
  const query = `
    SELECT *
    FROM dbo.OELINHST_SQL
    WHERE ord_no = @ordNo
    AND inv_no = @invNo
    ORDER BY A4GLIdentity DESC
  `;

  const result = await pool.request()
    .input("ordNo", sql.VarChar, ordNo)
    .input("invNo", sql.VarChar, invNo.toString())
    .query(query);

  if (result.recordset.length > 0) {
    let rowIndex = 1;
    let descriptionIndex = 1;
    let runningSubTotal = 0;

    for (const row of result.recordset) {
      handleRow(row, rowIndex, descriptionIndex, clonedInvoiceObject);
      rowIndex += 2;
      descriptionIndex += 2;
      runningSubTotal += row.unit_price * row.qty_to_ship;
    }

    clonedInvoiceObject.SubTotal = runningSubTotal.toFixed(2);
  } else {
    console.log("No line items found for this order number and invoice number.");
  }
}

function handleRow(row, rowIndex, descriptionIndex, clonedInvoiceObject) {
  clonedInvoiceObject[`QtyOrdered_${rowIndex}`] = row.qty_ordered;
  clonedInvoiceObject[`QtyBackOrdered_${rowIndex}`] = row.qty_bkord;
  clonedInvoiceObject[`QtyShipped_${rowIndex}`] = row.qty_to_ship;
  clonedInvoiceObject[`ItemNumber_${rowIndex}`] = row.item_no;
  clonedInvoiceObject[`ItemDescription_${descriptionIndex}`] = row.item_desc_1;
  clonedInvoiceObject[`ItemDescription_${descriptionIndex + 1}`] = row.item_desc_2;
  clonedInvoiceObject[`UnitPrice_${rowIndex}`] = row.unit_price.toFixed(5);
  clonedInvoiceObject[`UnitOfMeasure_${rowIndex}`] = row.uom;

  const extendedPrice = row.unit_price * row.qty_to_ship;
  clonedInvoiceObject[`ExtendedPrice_${rowIndex}`] = extendedPrice.toFixed(2);
}

module.exports = mapValues;
