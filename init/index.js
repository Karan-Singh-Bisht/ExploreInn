const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main(){
    await mongoose.connect(MONGO_URL);
}

//Initializing data in database.

const initDB = async() => {
    await Listing.deleteMany({});  //Delete all the previous data
    initData.data = initData.data.map((obj) => ({...obj, owner : "65afb2290a6ce3803949c27f"}));  //Later on added to give an owner to the reviews.
    await Listing.insertMany(initData.data);  // initData is an object and data is a value.
    console.log("data was initialized");
};

initDB();