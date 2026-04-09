const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Path  = require("path");
const mongo_url = "mongodb://127.0.0.1:27017/Wanderlust"
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/reviews.js");
const userRouter=require("./routes/user.js");
main()
    .then(() => {
    console.log("connected");
     })
    .catch((err) => {
        console.log(err);
    });

async function main(){
    await mongoose.connect(mongo_url);
}

app.set("view engine","ejs");
app.set("views",Path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));//used to read form data to app.ejs
app.use(methodOverride("_method"));
app.engine('ejs' ,ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret : "mysupersecretcode",
    resave:false, //false → saves only when something changes
    saveUninitialized:false, //true → creates empty session for every user(without login)
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000, 
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    },
};
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());  //passport makes authentication easier,quick setup.
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));  //Use username & password login, and let the User model verify users.

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//serializeUser → save roll number
//deserializeUser → get full student details when needed

app.use((req,res,next) => {
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
});
// app.get("/demouser" ,async (req , res) =>{
//    let fakeuser=new User({
//     email : "student@gmail.com",
//     username:"delta-student",

//    });
//   let registeredUser=await User.register(fakeuser,"helloworld");
//   res.send(registeredUser);
// });





app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);




//* it can be matched with every route if any entered route is not matching with existing route then error object will be created
//below ones are middlewares normally they are like client->req->middlware->req. middleware will helps for the req(not exact meaning)
app.use((req,res,next) => {
    next(new ExpressError(404,"page not found!"));
});//after this error will enter into class expresserror and oject will be created and then next(err) i.e app.use()
//if any backened error occurs means they will handle the errors

app.use((err,req,res,next) => {
    let {statusCode=500,message}=err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});






app.listen(8080 , (req , res) =>{
    console.log("server is listening");
});