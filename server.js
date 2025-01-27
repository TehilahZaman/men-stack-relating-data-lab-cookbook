const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");

const usersCtrl = require("./controllers/users.js");
const foodsCtrl = require("./controllers/foods.js");
const authCtrl = require("./controllers/auth.js");

const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");

const port = process.env.PORT ? process.env.PORT : "3000";
//ORDER doesn't metter for the variables

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
// app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  res.render("index.ejs", {
    user: req.session.user,
  });
});

app.get("/vip-lounge", (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.send("Sorry, no guests allowed.");
  }
});

//ORDER MATTERS
//we want all the views to have access to the user in the cookie to varify is a user is signed in
app.use(passUserToView);
// we want not signed in and signed in peopel to access the authorization / sign in pages
app.use("/auth", authCtrl);
// we want to check is users are signed it
app.use(isSignedIn);
// only signed in users can access these requests/pages
app.use("/users/:userId/foods", foodsCtrl);
// -- only signed in people can access other users and their pantries
app.use("/users", usersCtrl);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
