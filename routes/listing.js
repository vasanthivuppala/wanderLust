const express=require("express");
const router=express.Router();
const wrapasync=require("../utils/wrapasync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing}=require("../middleware.js");
const {index , rendernewform ,showlisting ,createlisting,rendereditform ,updatelisting,destroylisting} = require("../controllers/listings.js");

//index route
router.get("/" , wrapasync(index));


//new route create
router.get("/new",isLoggedIn, rendernewform);

//show route
router.get("/:id" ,isLoggedIn,wrapasync(showlisting));


//create post
router.post("/" ,isLoggedIn,validateListing, wrapasync(createlisting));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapasync(rendereditform));

//route update
router.put("/:id" ,isLoggedIn,isOwner,validateListing,wrapasync(updatelisting));

//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapasync(destroylisting));

module.exports=router;