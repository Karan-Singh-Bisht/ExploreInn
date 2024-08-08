require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");

const db = require("./config/db");
db();

app.set("view engine", "ejs");
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static(path.join(__dirname, "public")));

const listingRoute = require("./routes/listingRoute");
const userRoute = require("./routes/userRoute");

app.use("/", listingRoute);
app.use("/user", userRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
