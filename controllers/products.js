const express = require('express');
const router = express.Router();

const productModel = require("../model/product");

//Products Route
router.get("/products", (req, res)=>{
   res.render("products/products", {
      title: "Products",
      heading: "Our Products",
      products: productModel.getAllProducts()
      
   });
});

module.exports = router;