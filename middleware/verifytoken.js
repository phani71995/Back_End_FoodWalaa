const Vendor = require("../model/Vendor.js");
const jwtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require('express');
const dotenv = require("dotenv");
dotenv.config();
const app = express()
app.use(express.json());
const secratekey = process.env.mycode

const verifyToken = async (req, res, next) => {

    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({ error: "Enter token value" })
    }
    try {
        const decodeToken = jwtoken.verify(token, secratekey);//decodeToken means vendor id
        const vendor = await Vendor.findById(decodeToken.vendorId);
        if (!vendor) {
            return res.status(404).json({ error: "vendor not found" })
        }
        req.vendorId = vendor._id;
        next();
    }
    catch (error) {
        return res.status(500).json({ error: "Invalid token" })

    }


}
module.exports = verifyToken;