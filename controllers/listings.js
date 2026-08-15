const Listing=require("../models/listing.js");

module.exports.index=async (req , res) =>{
 const listings = await Listing.find({});//populate replace review ids with actual data
        res.render("listings/index.ejs" ,{listings});
    };

module.exports.rendernewform=(req , res) =>{
    res.render("listings/new.ejs");
};

module.exports.showlisting=async (req,res) =>{
    let {id} =req.params;
    const listing=await Listing.findById(id)
    .populate({path: "reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error" , "Listing was not found!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createlisting=async (req,res,next) =>{
    const newlist = new Listing(req.body.listing);
    newlist.owner=req.user._id;
    await newlist.save();
    req.flash("success" , "New Listing created!");
    res.redirect("/listings");
};

module.exports.rendereditform=async (req,res) =>{
    let {id} =req.params;
    const listing = await Listing.findById(id);
     if(!listing){
        req.flash("error" , "Listing was not found!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs" , {listing});
};

module.exports.updatelisting=async(req , res) =>{
    let {id} =req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success" , "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroylisting=async (req,res) => {//when it triggered then automatically db post middleware will be triggered because to remove the aligned reviews.
    let {id}=req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Deleted!");
    res.redirect(`/listings`);
};