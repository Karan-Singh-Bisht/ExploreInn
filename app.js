require("dotenv").config();

const express = require("express");
const app = express();

const db = require("./config/db");
db();

const listingRoute = require("./routes/listingRoute");
const userRoute = require("./routes/userRoute");

app.use("/listing", listingRoute);
app.use("/user", userRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
