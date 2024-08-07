const mongoose = require("mongoose");
const { DB_NAME } = require("../constants");

const db = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("Connected to MONGODB");
  } catch (err) {
    console.log("MONGODB connextion failed!", err);
    process.exit(1);
  }
};

module.exports = db;
