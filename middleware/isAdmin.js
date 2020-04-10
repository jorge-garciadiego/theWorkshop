const isAdmin = (req,res,next)=>{

   if(req.session.userInfo.role == "Admin"){

      next()

   }else{

      res.redirect("/login");

   }
}

module.exports = isAdmin;