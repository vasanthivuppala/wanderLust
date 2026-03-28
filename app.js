const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Path  = require("path");
const mongo_url = "mongodb://127.0.0.1:27017/Wanderlust"
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/reviews.js");
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


app.get("/" , (req , res) =>{
    res.send("hi");
});





app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);


//handling the server side errors
//this runs only when any route gets errors

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