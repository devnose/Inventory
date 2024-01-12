const router = require("express").Router();
const InvoiceDetails = require("../Model/InvoiceDetails");
const Invoice = require("../Model/InvoiceDetails");
const sendEmail = require("../SendEmail");
const getInvoiceById = require("./InoiceGen/invoiceHandler");
const fs = require('fs').promises;  // Make sure to require fs.promises





// retrieve list of Invoices with pagination
router.get("/retrieve", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;
    
    // Log to debug
    console.log(`Page: ${page}, Limit: ${limit}, SkipIndex: ${skipIndex}`);

    // Fetch and sort by ID (assuming ID is the field)
    const all = await Invoice.find()
      .sort({ "id": -1 })
      .skip(skipIndex)
      .limit(limit)
      .allowDiskUse(true)  // Opt-in to use disk for sort
      .select(['-__v', '-_id']);

    const total = await Invoice.countDocuments();

    // Log to debug
    console.log(`Total: ${total}, Total Pages: ${Math.ceil(total / limit)}`);
    
    res.json({ data: all, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Function to convert a Node.js Buffer to an ArrayBuffer
const bufferToArrayBuffer = (buffer) => {
  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return arrayBuffer;
};


//send invoice via email 

router.post("/send", async (req, res) => {
  // If you're still using getInvoiceById, you can uncomment the line below
  await getInvoiceById(req.body.attachment.attachData.toString());

  try {
    // Function to convert a Node.js Buffer to an ArrayBuffer
    const bufferToArrayBuffer = (buffer) => {
      const arrayBuffer = new ArrayBuffer(buffer.length);
      const view = new Uint8Array(arrayBuffer);
      for (let i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
      }
      return arrayBuffer;
    };

    // Make sure you're using fs.promises.readFile
    const data = await fs.readFile("C:\\Users\\aaront\\Desktop\\react-admin-dashboard-master\\backend\\Routes\\InoiceGen\\Invoice-Pdf\\"+ req.body.attachment.name+'.pdf');
    const arrayBuffer = bufferToArrayBuffer(data);

    console.log('ArrayBuffer:', arrayBuffer);
    const finalBody = { ...req.body };

    finalBody.attachment.attachData = arrayBuffer;
    console.log(finalBody);

    // Uncomment this if you have sendEmail implemented
    await sendEmail(finalBody);

    res.json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Failed to read PDF or send email:', error);
    res.status(500).json({ message: 'Failed to send email', error });
  }
});







  



  module.exports = router;
