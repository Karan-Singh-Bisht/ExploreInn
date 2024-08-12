require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");

const db = require("./config/db");
db();

app.set("view engine", "ejs");
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.engine("ejs", ejsMate);

//Route Declaration
const listingRoute = require("./routes/listingRoute");
const userRoute = require("./routes/userRoute");

app.use("/listings", listingRoute);
app.use("/user", userRoute);
app.all("*", (req, res, next) => {
  {
    (statusCode = 404), (message = "Page Not Found!");
  }
  res.status(statusCode).render("error", { statusCode, message });
});
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.render("error", { message, statusCode });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
