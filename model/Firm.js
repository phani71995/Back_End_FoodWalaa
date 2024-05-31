const mongoose = require("mongoose");
const firmSchema = new mongoose.Schema(
    {
        firmname: {
            type: String,
            required: true,
            unique: true
        },
        area: {
            type: String,
            required: true,


        },
        category:
        {
            type: [
                {
                    type: String,
                    enum: ["veg", "non-veg"]
                }]

        },
        region:
        {
            type: [
                {
                    type: String,
                    enum: ["south-india", "north-india", "chinese", "bakary"]
                }]

        },
        offer: {
            type: String,



        },
        image: {
            type: String,



        },
        vendor: [
            {

                type: mongoose.Schema.Types.ObjectId,
                ref: "vendor"

            }
        ],
        products: [
            {

                type: mongoose.Schema.Types.ObjectId,
                ref: "product"

            }
        ]
    }
);
// Create the Vendor model
const Firm = mongoose.model('firm', firmSchema);

module.exports = Firm;