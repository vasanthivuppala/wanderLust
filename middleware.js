module.exports.isLoggedIn=(req,res,next) => {
        if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;//req.originalUrl → the URL the user originally tried to access  req.session → stores data for that user across requests
        req.flash("error","you must be logged in to create listing!");
        return res.redirect("/login");
}
next();
    };


module.exports.saveRedirectUrl = (req,res,next) =>{
        if(req.session.redirectUrl){
                res.locals.redirectUrl=req.session.redirectUrl;
        }
        next();
};