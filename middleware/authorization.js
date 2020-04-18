const dashboardLoader = (req,res)=>{

   if(req.session.userInfo.role == "Admin"){

      res.redirect("products/admin")

   }else{

      res.render("admin/profile");

   }
}

module.exports = dashboardLoader;