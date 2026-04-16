const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

module.exports.createreview=async(req,res) => {
   // console.log(req.body);
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview._id);
    await newReview.save();//doc already remembers the model name so no need to mention model name while saving
    await listing.save();
    req.flash("success" , "New Review is Created!");
    res.redirect(`/listings/${listing._id}`);
 };

 module.exports.deletereview=async(req,res)=>{
    let {id , reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});//pull is used to delete
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review is Deleted!");
    res.redirect(`/listings/${id}`);
 };