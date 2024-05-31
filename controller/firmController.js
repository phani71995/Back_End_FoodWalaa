const Vendor = require("../model/Vendor.js");
const Firm = require("../model/Firm.js");
const Product = require("../model/Product.js");
const verifytoken = require("../middleware/verifytoken.js");
const jwtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require('express');
const multer = require('multer');
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express()
app.use(express.json());
const secratekey = process.env.mycode;




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/'); // Define the destination directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Define the file name
    }
});

// Initialize upload variable
const upload = multer({
    storage: storage,

});




const addFirm = async (req, res) => {

    try {
        const { firmname, area, category, region, offer } = req.body;
        const image = req.image ? req.file.filename : undefined;
        const vendor = await Vendor.findById(req.vendorId);
        if (!vendor) {
            return res.status(404).json({ error: "vendor not found" })
        }


        const newFirm = new Firm({
            firmname, area, category, region, offer, image, vendor: vendor._id
        })
        const savedfirm = await newFirm.save();
        vendor.firm.push(savedfirm);
        await vendor.save();
        return res.status(200).json({ message: "firm add successfuly" })
    }
    catch (error) {
        return res.status(500).json({ error: "firm add failed due to internal error" })
    }

}


const firmDeletedById = async (req, res) => {
    const firmId = req.params.firmId;
    try {
        const deletedfirm = await Firm.findByIdAndDelete(firmId);


        if (!deletedfirm) {
            res.status(404).json({ error: "Invalid firmId" });
        }
        const productDeletionPromises = deletedfirm.products.map((product) => Product.findByIdAndDelete(product._id));

        await Promise.all(productDeletionPromises);

        res.status(201).json({
            message: "firm is deleted",
            deleted: deletedfirm
        });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }


}
module.exports = { addFirm: [upload.single("image"), addFirm], firmDeletedById };