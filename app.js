const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing=require("./models/listing.js");
const Path  = require("path");
const mongo_url = "mongodb://127.0.0.1:27017/Wanderlust"
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const wrapasync=require("./utils/wrapasync.js");
const expresserror=require("./utils/ExpressError.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema");
const Review=require("./models/review.js");

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

const validateListing=(req,res,next)=>{
let {error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(404,error)
    }
    else{
        next();
    }
};

const validatereview=(req,res,next)=>{
let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(404,error)
    }
    else{
        next();
    }
};
//index routes
app.get("/listings" , wrapasync(async (req , res) =>{
 const listings = await Listing.find({});//populate replace review ids with actual data
        res.render("listings/index.ejs" ,{listings});
    }));


//new route create
app.get("/listings/new", wrapasync((req , res) =>{
    res.render("listings/new.ejs");
}));

//show route
app.get("/listings/:id" ,wrapasync(async (req,res) =>{
    let {id} =req.params;
    const listing=await Listing.findById(id).populate("reviews");
    if(!listing){
        return res.send("Listing not found");
    }
    res.render("listings/show.ejs",{listing});
}));


//create post
app.post("/listings" ,validateListing, wrapasync(async (req,res,next) =>{
    const newlist = new Listing(req.body.listing);
    await newlist.save();
    res.redirect("/listings");
})   
);

//edit route
app.get("/listings/:id/edit" , wrapasync(async (req,res) =>{
    let {id} =req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing});
}));

//route update
app.put("/listings/:id" ,validateListing,wrapasync(async(req , res) =>{
    let {id} =req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id" , wrapasync(async (req,res) => {//when it triggered then automatically db post middleware will be triggered because to remove the aligned reviews.
    let {id}=req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    res.redirect(`/listings`);
}));

//Reviews
//reviews post route
 app.post("/listings/:id/reviews",validatereview,wrapasync(async(req,res) => {
   // console.log(req.body);
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    console.log(newReview);
    listing.reviews.push(newReview._id);
    await newReview.save();//doc already remembers the model name so no need to mention model name while saving
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
 }));

//delete route
app.delete("/listings/:id/reviews/:reviewId",wrapasync(async(req,res)=>{
   let {id , reviewId}=req.params;
   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});//pull is used to delete
   await Review.findByIdAndDelete(reviewId);
   res.redirect(`/listings/${id}`);
}));



// app.get("/testListing" ,async (req , res) =>{
//     let sampleListing = new Listing({
//         title: "My new villa",
//         description: "by the beach",
//         price: 1200,
//         location: "calangute, goa",
//         country: "india"
//     });

//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("ccc");

// });

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