const express=require("express");
const router=express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapasync=require("../utils/wrapasync.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const {signup , rendersignupform , renderloginform , login , logout}=require("../controllers/user.js");

router.get("/signup", rendersignupform);

router.post("/signup",wrapasync(signup));

router.get("/login" ,renderloginform);

router.post("/login",
  saveRedirectUrl,
  passport.authenticate("local",
  {failureRedirect:"/login",
  failureFlash:true}),login);

router.get("/logout",logout);
module.exports=router;