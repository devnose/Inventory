const mongoose = require("mongoose"); 

const ShowSchema = new mongoose.Schema(
    {
        showname: {
            type: String
        },
        address: {
            type: String
        },
        ship: {
            type: String
        },
        order: {
            type: String
        },
        equipment: {
            type: Array
        },
       
    }
); 

module.exports = mongoose.model("Shows", ShowSchema)