const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.js");

// index route to show all other users
router.get("/", async (req, res) => {
  try {
    // find all the users using the model
    //push them into the views doc for use and display
    const allUsers = await UserModel.find({});
    res.render("users/index.ejs", { users: allUsers });
  } catch (err) {
    console.log(err);
    res.send(`error in rendering users, check terminal`);
  }
});

// show route to display the pantry of another user
router.get("/:userId", async (req, res) => {
  try {
    const otherUser = await UserModel.findById(req.params.userId);
    const otherPantry = otherUser.pantry;
    console.log(otherUser);

    res.render("users/show.ejs", { user: otherUser });
  } catch (err) {
    console.log(err);
    res.send(`Error showing user's pantry, check terminal `);
  }
});

module.exports = router;
