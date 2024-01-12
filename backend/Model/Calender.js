const mongoose = require("mongoose"); 

const CalenderSchema = new mongoose.Schema(
    {
        title: {
            type: String
        },
        start: {
            type: String
        },
        end: {
            type: String
        },
        id: {
            type: String
        },
        allDay: {
            type: String
        },

        location: {
            type: String
        },

        description: {
            type: String
        },

        category: {
            type: String
        }, 

        repeating: {
            type: Boolean
        }

    }
); 

module.exports = mongoose.model("Calender", CalenderSchema)