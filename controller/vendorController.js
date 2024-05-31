const Vendor = require("../model/Vendor.js");

const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require('express');
const dotenv = require("dotenv");
dotenv.config();
const app = express()
app.use(express.json());
const secratekey = process.env.mycode

const vendorRegister = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const VendorEmail = await Vendor.findOne({ email });
        if (VendorEmail) {
            return res.status(400).json(" email already taken")

        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword
        })
        await newVendor.save();
        res.status(201).json({ message: "vendor register successfully" })
        console.log("registerd")
    }

    catch (error) {
        res.status(500).json({ error: "internal server error" })
        console.error(error)

    }

}
const vendorsLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const vendor = await Vendor.findOne({ email });
        console.log(email);
        console.log(vendor);
        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
            return res.status(401).json(" Invalid details password wrong")

        }

        const jwtToken = jsonwebtoken.sign({ vendorId: vendor._id }, secratekey, { expiresIn: "1h" })
        res.status(200).json({
            message: "vendorLogin successfully",
            token: jwtToken
        })
        console.log("logined    " + jwtToken)
    }

    catch (error) {
        res.status(500).json({ error: "internal server error" })
        console.error(error)

    }


}



const getAllvendor = async (req, res) => {
    try {
        const vendor = await Vendor.find().populate("firm");
        res.send(vendor);
        //res.status(201).json({ message: "get allvendors successfully" })
        console.log("get allvendors successfully")
    }
    catch (error) {
        //res.status(500).json({ error: "internal server error" })
        console.error(error)

    }

}
const getVendorById = async (req, res) => {
    const emailId = req.params.id;
    try {
        const vendor = await Vendor.findById(emailId).populate("firm");
        res.send(vendor);
        console.log(vendor);
        if (!vendor) {
            //return res.status(401).json(" Invalid details password wrong")
            console.log("get vendorsById error")

        }
        else {
            //res.status(201).json({ message: "get allvendors successfully" })
            console.log("get vendorsById successfully")
        }
    }

    catch (error) {
        //res.status(500).json({ error: "internal server error" })
        console.error(error)
    }

}

module.exports = { vendorRegister, vendorsLogin, getAllvendor, getVendorById };