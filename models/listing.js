const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const ListingSchema = mongoose.Schema({
    title: {
        type: String
    },
    description: {
       type: String,

    },
    image: {
        type: String,
        default: "https://i.pinimg.com/1200x/3e/13/33/3e13334c746867842ad72301e82ddb82.jpg",
    set: (v) => v === ""
      ? "https://i.pinimg.com/1200x/3e/13/33/3e13334c746867842ad72301e82ddb82.jpg"
      : v
    },
    price: {
        type: Number
    },
    location:{
        type:String
    },
    country: {
        type: String
    },
    reviews:[
          {
        type:Schema.Types.ObjectId,
        ref:"Review",
          },
    ],

    
});

const listing = mongoose.model("Listing" , ListingSchema);

module.exports = listing;