const express=require("express");
const router=express.Router({ mergeParams: true });
const Review=require("../models/review.js");
const wrapasync=require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const listings=require("./listing.js");
const {validatereview,isLoggedIn,isReviewAuthor}=require("../middleware.js");



//Reviews
//reviews post route
 router.post("/",
    isLoggedIn,
    isReviewAuthor,
    validatereview,
    wrapasync(async(req,res) => {
   // console.log(req.body);
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview._id);
    await newReview.save();//doc already remembers the model name so no need to mention model name while saving
    await listing.save();
    req.flash("success" , "New Review is Created!");
    res.redirect(`/listings/${listing._id}`);
 }));

//delete route (review)
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapasync(async(req,res)=>{
   let {id , reviewId}=req.params;
   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});//pull is used to delete
   await Review.findByIdAndDelete(reviewId);
   req.flash("success" , "Review is Deleted!");
   res.redirect(`/listings/${id}`);
}));

module.exports=router;