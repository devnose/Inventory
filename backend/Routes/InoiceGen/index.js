const { getInvoiceById } = require("./invoiceHandler");
const { getInvoiceByDate } = require("./invoiceHandler");
const grabInvoiceDetails = require("./detailedInvoices");
const router = require("express").Router();
const fs = require('fs').promises;  // Make sure to require fs.promises
const fsc = require('fs');  // Make sure to require fs.promises

const path = require("path");
const Reference = require("../../Model/Reference");
const {PDFDocument} = require('pdf-lib')
const sendEmail = require("../../SendEmail");
const DBshowConnect = require("./DBshow");
const findInvoiceById = require("./DBshow");
const Shows = require("../../Model/Shows");



router.get("/grab/:invoice", async (req, res) => {
  const invoiceId = req.params.invoice;
  console.log(invoiceId)

  // Check if invoiceId is undefined or falsy (e.g., empty string)
if (invoiceId === 'undefined') {
  res.status(400).send("Invalid invoice ID");
  console.log('udejkejkjk')
  return; // Stop further execution
}


  const filePath = path.join(
    "C:/Users/aaront/Desktop/react-admin-dashboard-master/backend/Routes/InoiceGen/Invoice-Pdf",
    `Invoice-${invoiceId}.pdf`
  );

  // Check if file exists
  if (!fsc.existsSync(filePath)) {
    // If file doesn't exist, generate it using getInvoiceById
    // await getInvoiceById(invoiceId);
  }

  
  await getInvoiceById(invoiceId);

  // Try sending the file
  try {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=${invoiceId}.pdf`);

    const pdfStream = fsc.createReadStream(filePath);
    pdfStream.pipe(res);
  } catch (error) {
    console.error("Error sending the PDF:", error);
    res.status(500).send("Internal Server Error. Unable to send the PDF.");
  }



});

router.get("/details", async (req, res) => {
  const page = parseInt(req.query.page || 1);
  const pageSize = parseInt(req.query.pageSize || 30);
  const rows = await grabInvoiceDetails(page, pageSize);
  res.json(rows);
});

router.get("/que", async (req, res) => {
  const invoiceDate = req.query.date.toString();
  const rows = await getInvoiceByDate(invoiceDate);

  if (rows && typeof rows === "object") {
    if ("data" in rows) {
      if (rows.data) {
        // Do something with rows.data
        const rowsRef = rows.ref;
        for (const rowsData of rowsRef) {
          const existingRecord = await Reference.findOne({
            InvoiceNo: rowsData.InvoiceNo,
          });
          if (existingRecord) {
            console.log("exists");
          } else {
            const ref = new Reference(rowsData);
            await ref.save();
          }
        }
        Reference.removeDuplicates()
        const rowsData = rows.data;
        res.json(rowsData);
      } else {
        // rows.data is empty
        console.warn(
          "No data available for the given invoice date:",
          invoiceDate
        );
        res.json({ data: "empty" });
      }
    } else {
      // 'data' property does not exist on rows
      res.json(rows);
      console.warn(
        "No data property in the returned object for the given invoice date:",
        invoiceDate
      );
    }
  } else {
    // rows is null or undefined
    res.json([]);

    console.warn("No data returned for the given invoice date:", invoiceDate);
  }
});


router.get("/find", async(req, res) => {
  // Retrieve the order number from the request body

   
  const orderNumber = req.query.orderNumber;
  DBshowConnect(orderNumber).then(data => {

    const newShow = new Shows(data)
    try {

      const savedShow =  newShow.save(); 
      res.status(200).json(data); 
      
  } 

  catch (err) {

      res.status(500).json(err); 
  }
  })
  const dirPath = "C:\\Users\\aaront\\Desktop\\react-admin-dashboard-master\\backend\\Routes\\InoiceGen\\Invoice-Pdf\\Invoice-";

  // try {
  //     // Generate or retrieve the invoice PDF
  //     await getInvoiceById(orderNumber.toString());

  //     // Read the PDF file
  //     const pdfBytes = await fs.readFile(`${dirPath}${orderNumber}.pdf`);
  //     const pdfDoc = await PDFDocument.load(pdfBytes);

  //     // No need to merge since it's a single document
  //     const pdfBytesOut = await pdfDoc.save();

  //     // Send the PDF file in the response
  //     res.contentType('application/pdf');
  //     res.send(Buffer.from(pdfBytesOut));
  // } catch (error) {
  //     console.error('Error occurred:', error);
  //     res.status(500).send('An error occurred while generating the PDF');
  // }
});



router.post("/getpdf", async(req, res) => {

  //assing the selected rows
  const selectedRows = req.body.selectedData; 
  const dirPath =  "C:\\Users\\aaront\\Desktop\\react-admin-dashboard-master\\backend\\Routes\\InoiceGen\\Invoice-Pdf\\Invoice-"

  for(const rows of selectedRows) {
    await getInvoiceById(rows.toString())
  }

  const pdfDocs = await Promise.all(
    selectedRows.map(async id => {
        const pdfBytes = await fs.readFile(dirPath+id+".pdf");
        return await PDFDocument.load(pdfBytes);
    })
);

const mergedPdf = await PDFDocument.create();


for (const pdfDoc of pdfDocs) {
  const pageCount = pdfDoc.getPageCount();
  for (let i = 0; i < pageCount; i++) {
      const [pdfPage] = await mergedPdf.copyPages(pdfDoc, [i]);
      mergedPdf.addPage(pdfPage);
  }
}


const mergedPdfBytes = await mergedPdf.save();

const mergedPdfBuffer = Buffer.from(mergedPdfBytes);



    //completed attachment 
    res.contentType('application/pdf');
    res.send(mergedPdfBuffer);




   




  
})


router.post("/sendemail", async (req, res) => {
  console.log(req.body);
  const selectedRows = req.body;

  for (const rows of selectedRows) {
    //process invoice and save locally
    await getInvoiceById(rows.InvoiceNo.toString());


    // Make sure you're using fs.promises.readFile
    const data = await fs.readFile(
      "C:\\Users\\aaront\\Desktop\\react-admin-dashboard-master\\backend\\Routes\\InoiceGen\\Invoice-Pdf\\" +
       "Invoice-"+rows.InvoiceNo +
    
    
    + -  ".pdf"
    );

    //completed attachment 
    const arrayBuffer = bufferToArrayBuffer(data);

        // get the invoice ready for dispatch
        const mailConfig = {
          fromid: "accounting@kleertech.com",
          selectedEmails: rows.CustomerEmail,
          subject: "Invoice From Kleertech",
          body: "Here is Your Invoice",
          attachment: { name: "Invoice-" + rows.InvoiceNo, attachData: arrayBuffer },
        };


        console.log(mailConfig)

    
    // Uncomment this if you have sendEmail implemented
    // const emailResult = await sendEmail(mailConfig);
        const emailResult = 'success'

    if(emailResult.status === 'success'){
      //Change status 
      emailResult.id = rows.InvoiceNo
      emailResult.update = 1;
      const updateStatus = await Reference.findOneAndUpdate({InvoiceNo: rows.InvoiceNo}, {Status: 1}, {new: true});
      if (updateStatus) {
        console.log("Document updated:");
        res.write(JSON.stringify(emailResult)+'\n')

      } else {
        console.log(`Document with id ${rows.InvoiceNo} not found.`);
      }
    
  
    } else {
      res.write(JSON.stringify(emailResult))
    }
      // Wait for 10 seconds before sending the next email
      await sleep(5000);

  }

  res.end()
});


router.get("/status", async (req, res) => {
  console.log('get Status')
  const filter = {};
const all = await Reference.find(filter, {_id: 0, __v: 0});
console.log(all)
res.send(all)
}); 





//read invoice to send attachment
const bufferToArrayBuffer = (buffer) => {
  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return arrayBuffer;
};


function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}



module.exports = router;
