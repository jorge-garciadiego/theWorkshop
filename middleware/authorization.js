const dashboardLoader = (req,res)=>{

   if(req.session.userInfo.role == "Admin"){

      res.render("general/adminProfile")

   }else{

      res.render("general/profile");

   }
}

module.exports = dashboardLoader;