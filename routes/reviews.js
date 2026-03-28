const express=require("express");
const router=express.Router({ mergeParams: true });
const Review=require("../models/review.js");
const {reviewSchema}=require("../schema.js");
const wrapasync=require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const listings=require("./listing.js");



const validatereview=(req,res,next)=>{
let {error}=reviewSchema.validate(req.body);

    if(error){
        throw new ExpressError(404,error)
    }
    else{
        next();
    }
};
//Reviews
//reviews post route
 router.post("/",validatereview,wrapasync(async(req,res) => {
   // console.log(req.body);
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview._id);
    await newReview.save();//doc already remembers the model name so no need to mention model name while saving
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
 }));

//delete route
router.delete("/:reviewId",wrapasync(async(req,res)=>{
   let {id , reviewId}=req.params;
   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});//pull is used to delete
   await Review.findByIdAndDelete(reviewId);
   res.redirect(`/listings/${id}`);
}));

module.exports=router;