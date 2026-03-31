const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    }

});

userSchema.plugin(passportLocalMongoose); //username,hashing,salting will be added automatically without writing code.
module.exports=mongoose.model("User",userSchema);

