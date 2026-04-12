module.exports.isLoggedIn=(req,res,next) => {
        if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing!");
        return res.redirect("/login");
}
next();
    };


module.exports.saveRedirectUrl = (req,res,next) =>{
        if(req.session.redirectUrl){
                res.locals.redirectUrl=req.session.redirectUrl;//Stores data only for the current request-response cycle re.locals is like temporary storage. session is like hard disk(permenant storage).
        }
        next();
};