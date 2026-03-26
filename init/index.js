const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const mongo_url = "mongodb://127.0.0.1:27017/Wanderlust"
//index.js is for db to insert data
main()
    .then(() => {
        console.log("🔥 INIT FILE RUNNING");
    console.log("connected");
     })
    .catch(err => {
        console.log(err);
     });

async function main(){
    await mongoose.connect(mongo_url);
}

const initdb = async() => {
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);//initdata is object containing data(documents)
    console.log("Data was initilized");
}

initdb();