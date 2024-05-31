const express = require('express');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const vendorrouter = require("./routes/vendorRoutes");
const firmrouter = require("./routes/firmroutes");
const productRoutes = require("./routes/productRoutes");
const bodyparser = require("body-parser");
const multer = require('multer');
const app = express()
dotenv.config();
mongoose.connect(process.env.Mongo_uri).then(() => {
    console.log("this is connect to data base");
}).catch((error) => {
    console.log(error);
})

app.listen(3600)
app.use(express.json());
app.get('/home', function (req, res) {
    res.send('welcome mango  ');

})
app.use("/vendor", vendorrouter);
app.use("/firm", firmrouter);
app.use("/product", productRoutes);
app.use("/uplods", express.static("uploads"));
app.use(bodyparser.json());

