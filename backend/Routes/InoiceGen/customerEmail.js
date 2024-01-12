const sql = require("mssql");
const connectToDB = require("./db");

// Constants for email array indices
const EA_EMAILADDR = 0;
const EA_COMMENT_1 = 1;
const EA_COMMENT_2 = 2;
const EA_CONTACT = 3;
const EA_CONTACT_2 = 4;

// Connection configuration
const config = {
  user: "sa",
  password: "Tss2380DB!",
  server: "DBServer",
  database: "DATA_77",
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};


// Connect to SQL Server
// sql.connect(config).then(() => {
//   console.log("Connected to the database.");
// }).catch(err => {
//   console.error("Error connecting:", err);
// });

// Validate email address
function isValidEmail(emailAddr) {
  const regEx = /^([a-zA-Z0-9_\-\.]+)@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/;
  return regEx.test(emailAddr);
}

// Decide which email category to place the email in
function categorizeEmail(emailAddr, validEmails,possibleEmails ) {
  if (!emailAddr) return;

  emailAddr = emailAddr.trim();

  if (isValidEmail(emailAddr)) {
    validEmails.push(emailAddr);
  } else if (emailAddr.includes("@")) {
    possibleEmails.push(emailAddr);
  }
}

// Main Function to Process Invoices and Emails
async function processInvoicesAndEmails(custNo, pool) {
 // Initialize the email lists for this particular customer
 let validEmails = [];
 let possibleEmails = [];
 let statePool; 

 await connectToDB().then((pool) => {
  statePool = pool; 
  })

  const request = new statePool.Request();
  const result = await request.input('custNo', sql.VarChar, custNo).query('SELECT * FROM ARCUSFIL_SQL WHERE cus_no = @custNo');  
  if (result.recordset.length > 0) {
    const record = result.recordset[0];
    categorizeEmail(record.email_addr, validEmails, possibleEmails);
    categorizeEmail(record.cmt_1, validEmails, possibleEmails);
    categorizeEmail(record.cmt_2,  validEmails, possibleEmails);
    categorizeEmail(record.contact,  validEmails, possibleEmails);
    categorizeEmail(record.contact_2,  validEmails, possibleEmails);

    // More code to process these values...
  } else {
    console.log("*** CUSTOMER NOT FOUND ***");
  }

  return validEmails;
}


module.exports = { processInvoicesAndEmails };
