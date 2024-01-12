const mongoose = require("mongoose"); 

const ReferenceSchema = new mongoose.Schema(
    {
        InvoiceNo: {
            type: Number
        },
       
        Status: {
            type: Number
        },
    }
); 

const Reference = mongoose.model("Reference", ReferenceSchema)

// Add the function to remove duplicates
Reference.removeDuplicates = async function() {
    try {
      // Step 1: Find duplicates
      const duplicates = await this.aggregate([
        {
          $group: {
            _id: "$InvoiceNo",
            ids: { $push: "$_id" },
            count: { $sum: 1 }
          }
        },
        {
          $match: {
            count: { $gt: 1 }
          }
        }
      ]);
  
      // Step 2: Remove duplicates
      for (let duplicate of duplicates) {
        // Keep one document and remove the rest
        duplicate.ids.shift();
        await this.deleteMany({ _id: { $in: duplicate.ids } });
      }
    } catch (error) {
      console.error("Error removing duplicates:", error);
    }
  };


  module.exports = Reference