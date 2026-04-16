const express=require("express");
const router=express.Router({ mergeParams: true });
const Review=require("../models/review.js");
const wrapasync=require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const listings=require("./listing.js");
const {validatereview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const {createreview , deletereview}=require("../controllers/reviews.js");



//Reviews
//reviews post route
 router.post("/",isLoggedIn,validatereview,wrapasync(createreview));

//delete route (review)
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapasync(deletereview));

module.exports=router;