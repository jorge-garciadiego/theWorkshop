const dashboardLoader = (req,res)=>{

   if(req.session.userInfo.role == "Admin"){

      res.redirect("products/inventory")

   }else{

      res.render("general/profile");

   }
}

module.exports = dashboardLoader;