const express = require('express');
const app = express()
app.use(express.json());
const Product = require("../model/Product.js");
const Firm = require("../model/Firm.js");
const multer = require('multer');
const path = require("path")
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




const addProduct = async (req, res) => {

    try {
        const { productName, price, category, bestSeller, description } = req.body;
        const image = req.image ? req.file.filename : undefined;
        const firm = await Firm.findById(req.params.firmid);
        if (!firm) {
            return res.status(404).json({ error: "firm not found" })
        }


        const newProduct = new Product({
            productName, price, category, bestSeller, description, image, firm: firm._id
        })
        const savedproduct = await newProduct.save();
        firm.products.push(savedproduct);
        await firm.save();
        return res.status(200).json({ message: "firm add successfuly" })
    }
    catch (error) {
        return res.status(500).json({ error: "firm add failed due to internal error" })
    }

}


const ProductsGetByIdFirm = async (req, res) => {
    const firmid = req.params.firmid
    try {
        const firm = await Firm.findById(firmid);
        const resterntName = firm.firmname;

        if (!firm) {
            return res.status(404).json({ error: "Firm not found" });
        }

        console.log(firm);
        console.log("###########");

        const products = await Product.find({ firm: firmid });




        return res.status(200).json({
            message: "Get products successfully",
            resterntName: resterntName,
            products: products,

        });



    }
    catch (error) {
        return res.status(500).json({ error: "get products failed due to internal error" })
    }
}



const productDeletedById = async (req, res) => {
    const productId = req.params.productId;
    try {
        const deletedproduct = await Product.findByIdAndDelete(productId);
        if (!deletedproduct) {
            res.status(404).json({ error: "Invalid productId" });
        }
        res.status(201).json({ message: "product is deleted" });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }


}
module.exports = { addProduct: [upload.single("image"), addProduct], ProductsGetByIdFirm, productDeletedById };