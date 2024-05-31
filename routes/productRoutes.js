const productController = require("../controller/productController.js");
const express = require('express');


const router = express.Router();
router.post("/addproduct/:firmid", productController.addProduct);
router.get("/:firmid/product", productController.ProductsGetByIdFirm);
router.post("/deletedproduct/:productId", productController.productDeletedById);

router.get("/uploads/:imageName", (req, res) => {
    const imageName = req.params.imageName;
    res.headersSent('content-type', "image/jpeg");
    res.sendFile(path.join(__dirname, "..", "uploads", imageName))
})


module.exports = router;
