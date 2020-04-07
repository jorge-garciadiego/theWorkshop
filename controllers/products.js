 
const express = require('express');
const router = express.Router();
const productModel = require("../model/product");
const path = require("path");

//Route to direct user to Add a product form
router.get("/add", (req,res)=>{
   res.render("products/productsAddForm");
});

//Products Route
router.get("/list", (req, res)=>{
   productModel.find()
   .then((products)=>{

      const filteredProduct = products.map(product=>{
         return{
            id: product._id,
            bestSeller: product.bestSeller,
            title: product.title,
            description: product.description,
            artist:product.artist,
            category: product.category,
            price: product.price,
            productPic: product.productPic
         }
      });

      res.render("products/productsDashboard", {
         title: "Products",
         heading: "Our Products",
         data: filteredProduct     
      });

   })
   .catch(err=>console.log(`Error happend when pulling from the database: ${err}`));
   
  
});

router.get("/inventory",(req,res)=>{
   productModel.find()
   .then((products)=>{
      const filteredProducts = products.map(product=>{
         return{
            id: product._id,
            bestSeller: product.bestSeller,
            title: product.title,
            artist:product.artist,
            category: product.category,
            price: product.price,
            stock: product.stock,
            productPic: product.productPic
         }
      });

      res.render("products/productsInventory",{
         title: "Inventory",
         heading: "the Workshop Inventory",
         data: filteredProducts
      })
   })
   .catch(err=>console.log(`Error getting the product documents from the Database${err}`));
})

router.post("/add",(req,res)=>{
   const errors = [];

   const{title, description, artist, category, price, stock, bestSeller} = req.body;

   let valid = true;
   let pTitle = [];
   let pDescription = [];
   let pArtist = [];
   let pCat = [];
   let pPrice = [];
   let pStock = [];

   let titleLabel;
   let descriptionLabel;
   let artistLabel;
   let catLabel;
   let priceLabel;
   let stockLabel;

   const patterns = {
      name: /(?:\s*[a-zA-Z]+){1,3}/,
      desc: /[a-z0-9]/,
      patPrice: /^(?!0\.00)[1-9]\d{0,2}(,\d{3})*(\.\d\d)?$/,
      patStock: /^([1-9]|[1-8][0-9]|9[0-9]|[1-8][0-9]{2}|9[0-8][0-9]|99[0-9]|1000)$/
   };

   if(!patterns.name.test(title)){
      errors.push({description:'Type a name for the product'});
      pTitle = `Invalid Product Name`;
      valid = false;
   } else {
      titleLabel = title;
   }
   if(!patterns.desc.test(description)){
      errors.push({description:'Type a description for the product'});
      pDescription = `Invalid description`;
      valid = false;
   } else {
      descriptionLabel = description;
   }
   if(!patterns.name.test(artist)){
      errors.push({description:'Invalid Artist Name'});
      pArtist = `Invalid Artist Name`;
      valid = false;
   } else {
      artistLabel = artist;
   }
   if(!patterns.name.test(category)){
      errors.push({description: 'Invalid Category name'});
      pCat = `Invalid Catergory name`;
      valid = false;
   } else {
      catLabel = category;
   }
   if(!patterns.patPrice.test(price)){
      errors.push({description:'Invalid price'});
      pPrice = `Invalid price`;
      valid = false;
   } else {
      priceLabel = price;
   }
   if(!patterns.patStock.test(stock)){
      errors.push({description: 'Stock must be between 1 and 1000'});
      pStock = `Invalid stock number`;
      valid = false;
   } else {
      stockLabel = stock;
   }

   if(valid == false){
      res.render("products/productsAddForm", {
         title: "Add Product",
         errorMessages: errors,
         eTitle: pTitle,
         eDescription: pDescription,
         eArtist: pArtist,
         eCat: pCat,
         ePrice: pPrice,
         eStock: pStock,
         actualTitle: titleLabel,
         actualDescription: descriptionLabel,
         actualArtist: artistLabel,
         actualCat: catLabel,
         actualPrice: priceLabel,
         actualStock: stockLabel,
         actualBestSeller: bestSeller
      });
   } else {
      const newProduct = 
      {
         title: req.body.title,
         description: req.body.description,
         artist: req.body.artist,
         category: req.body.category,
         price: req.body.price,
         stock: req.body.stock,
         bestSeller: req.body.bestSeller,
         productPic: req.body.productPic
      }

      const product = new productModel(newProduct);

      product.save()

         .then((product)=>{
         req.files.productPic.name = `prod_pic${product._id}${path.parse(req.files.productPic.name).name}${path.parse(req.files.productPic.name).ext}`;

         req.files.productPic.mv(`public/uploads/${req.files.productPic.name}`)
         .then(()=>{

            productModel.update({_id:product._id},{
               productPic: req.files.productPic.name
            })
            .then(()=>{
               res.redirect("/products/list")
            })
            
         })
         }).catch(err=>{
            console.log(`Error entring into de data ${err}`);
         })

   }
}) 


router.get("/edit/:id",(req,res)=>{
   
   
   productModel.findById(req.params.id)
   .then((product)=>{
      const {_id, title, description, artist, category, bestSeller, price, stock, productPic} = product;
      res.render("products/productsEditForm",{
         _id,
         title,
         description,
         artist,
         category,
         bestSeller,
         price,
         stock,
         productPic
      })
   })
   .catch(err=>`Error pulling the document from the database ${err}`);
   
})

router.put("/update/:id",(req,res)=>{

   const product =
   {
      title: req.body.title,
      description: req.body.description,
      artist: req.body.artist,
      category: req.body.category,
      bestSeller: req.body.bestSeller,
      price: req.body.price,
      stock: req.body.stock,
      //productPic: req.body.productPic

   }
      productModel.updateOne({_id:req.params.id}, product)
      .then(()=>{
         res.redirect("/products/inventory")
      })
      .catch(err=>`Error updating the document into the database ${err}`)
         /*
         .then((product)=>{
         req.files.productPic.name = `prod_pic${product._id}${path.parse(req.files.productPic.name).name}${path.parse(req.files.productPic.name).ext}`;

         req.files.productPic.mv(`public/uploads/${req.files.productPic.name}`)
         .then(()=>{

            productModel.update({_id:product._id},{
               productPic: req.files.productPic.name
            })
            .then(()=>{
               res.redirect("/products/list")
            })
            
         })
         }).catch(err=>{
            console.log(`Error entring into de data ${err}`);
         })
         */
})




module.exports = router;