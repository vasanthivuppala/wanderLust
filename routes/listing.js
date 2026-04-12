const express=require("express");
const router=express.Router();
const wrapasync=require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const {isLoggedIn}=require("../middleware.js");

const validateListing=(req,res,next)=>{
let {error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(404,error)
    }
    else{
        next();
    }
};
//index route
router.get("/" , wrapasync(async (req , res) =>{
 const listings = await Listing.find({});//populate replace review ids with actual data
        res.render("listings/index.ejs" ,{listings});
    }));


//new route create
router.get("/new",isLoggedIn, wrapasync((req , res) =>{
    res.render("listings/new.ejs");
}));

//show route
router.get("/:id" ,isLoggedIn,wrapasync(async (req,res) =>{
    let {id} =req.params;
    const listing=await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error" , "Listing was not found!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));


//create post
router.post("/" ,isLoggedIn,validateListing, wrapasync(async (req,res,next) =>{
    const newlist = new Listing(req.body.listing);
    newlist.owner=req.user._id;
    await newlist.save();
    req.flash("success" , "New Listing created!");
    res.redirect("/listings");
})   
);

//edit route
router.get("/:id/edit" ,isLoggedIn, wrapasync(async (req,res) =>{
    let {id} =req.params;
    const listing = await Listing.findById(id);
     if(!listing){
        req.flash("error" , "Listing was not found!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs" , {listing});
}));

//route update
router.put("/:id" ,isLoggedIn,validateListing,wrapasync(async(req , res) =>{
    let {id} =req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success" , "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id" , isLoggedIn,wrapasync(async (req,res) => {//when it triggered then automatically db post middleware will be triggered because to remove the aligned reviews.
    let {id}=req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Deleted!");
    res.redirect(`/listings`);
}));

module.exports=router;