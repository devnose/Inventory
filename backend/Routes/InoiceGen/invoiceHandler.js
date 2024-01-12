const sql = require("mssql");
const  {createInvoiceObject}  = require("./createInvoiceObject");
const  {createQue}  = require("./createInvoiceObject");

const  mapValues  = require("./mapValues");
const { fieldData } = require("./fieldData");
const dbConnection = require('./dbConnection');
const dbConfig = require('./dbConfig');
const pdffiller = require('pdffiller')

const sourcePDF = "C:\\Users\\aaront\\Desktop\\react-admin-dashboard-master\\backend\\Routes\\InoiceGen\\Invoice-Template.pdf";

//Invoice Que Method - takes in date. 

async function getInvoiceByDate(date) {
  const pool = await dbConnection.getPool();
  const queResult = await findInvoiceByDate(date, pool); 


  if (queResult.rowsAffected && queResult.rowsAffected[0] === 0){

    console.log(`No invoice found with the given ID: ${date}`);
    return date; 
  
} else {

  console.log('found invoice ID: '+date)
  return await proccessQue(queResult.recordset, pool, sql);
}
}


async function getInvoiceById(invoiceId) {
  const pool = await dbConnection.getPool();
  
    const invoiceResult = await findInvoiceById(invoiceId, pool);

    if (invoiceResult.recordset.length > 0) {
        // console.log(invoiceResult)
      await processInvoice(invoiceResult.recordset[0], pool, sql);
    } else {
      console.log(`No invoice found with the given ID: ${invoiceId}`);
    }
 
}


async function findInvoiceByDate(date, pool) {
  if (!date) {
    console.log("No date provided");
    return { recordsets: [ [] ], recordset: [], output: {}, rowsAffected: [ 0 ] };
  }

  try {
    return await pool.request()
      .input('date', sql.VarChar, date) // Assuming the date is in string format and the corresponding SQL column is of VARCHAR type
      .query('SELECT * FROM dbo.OEHDRHST_SQL WHERE inv_dt = @date AND billed_dt != 0');
  } catch (err) {
    console.error(`Error running the query: ${err}`);
    return null;
  }
}



async function findInvoiceById(invoiceId, pool) {
  return await pool
    .request()
    .input("invoiceId", sql.VarChar, invoiceId)
    .query("SELECT * FROM dbo.OEHDRHST_SQL WHERE inv_no = @invoiceId");
}

async function processInvoice(invoiceData, pool, sql) {

  const clonedInvoiceObject =   createInvoiceObject(invoiceData);
  await mapValues(invoiceData.ord_no, invoiceData.inv_no,  pool, sql, clonedInvoiceObject);
  const cleanInvoice = cleanObject(clonedInvoiceObject); 
    await  generatePDF(cleanInvoice);

}


async function proccessQue(queData, pool, sql){

  return await createQue(queData, pool); 
 

}


function cleanObject(clonedInvoice){

    const cleanedObject = Object.entries(clonedInvoice).reduce(
        (acc, [key, value]) => {
          // If the value is a string, remove extra spaces
          if (typeof value === 'string') {
            acc[key] = value.trim();
          } 
          // If the value is null or undefined, don't add it to the new object
          else if (value === null || value === undefined) {
            // Do nothing
          } 
          // Otherwise, keep the value as it is
          else {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );
      return cleanedObject
}

function generatePDF(invoiceData) {
  return new Promise((resolve, reject) => {
      pdffiller.fillForm(
          sourcePDF,
          `C:/Users/aaront/Desktop/react-admin-dashboard-master/backend/Routes/InoiceGen/Invoice-pdf/Invoice-${invoiceData.InvoiceNo}.pdf`,
          invoiceData,
          (err) => {
              if (err) {
                  console.error("Error generating PDF:", err);
                  reject(err);
              } else {
                  console.log('Invoice created');
                  resolve();
              }
          }
      );
  });
}




 

// Start the process by calling the function and providing an invoice ID.
// Replace 'INV123' with the invoice ID you want to process.
module.exports = {getInvoiceById, getInvoiceByDate}