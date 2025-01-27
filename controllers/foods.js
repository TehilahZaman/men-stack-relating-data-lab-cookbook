const express = require("express");
const router = express.Router();

const UserModel = require("../models/user.js");

router.get("/", async (req, res) => {
  console.log(`hello`, req.session.user);
  try {
    const currentUser = await UserModel.findById(req.session.user._id);
    console.log(currentUser);
    res.render("foods/index.ejs", {
      pantry: currentUser.pantry,
    });
  } catch (err) {
    console.log(err);
    res.send(`Error rendering foods in pantry, check terminal`);
  }
});

router.get("/new", (req, res) => {
  res.render("foods/new.ejs");
});

router.post("/", async (req, res) => {
  try {
    const currentUser = await UserModel.findById(req.session.user._id);
    currentUser.pantry.push(req.body);
    await currentUser.save();
    console.log(currentUser, "<-- currentUser");
    res.redirect(`/users/${currentUser._id}/foods`);
  } catch (err) {
    console.log(err);
    res.send(`Error posting new food to pantry- check terminal`);
  }
});

router.get("/:foodId", async (req, res) => {
  try {
    const currentUser = await UserModel.findById(req.session.user._id);
    const foundFood = currentUser.pantry.id(req.params.foodId);
    res.render("foods/show.ejs", { food: foundFood });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

router.delete("/:foodId", async (req, res) => {
  try {
    const currentUser = await UserModel.findById(req.session.user._id);
    currentUser.pantry.id(req.params.foodId).deleteOne();
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/foods`);
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

router.get("/:foodId/edit", async (req, res) => {
  try {
    const currentUser = await UserModel.findById(req.session.user._id);
    const foundFood = currentUser.pantry.id(req.params.foodId);
    res.render("foods/edit.ejs", {
      food: foundFood,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

router.put("/:foodId", async (req, res) => {
  try {
    const currentUser = await UserModel.findById(req.session.user._id);
    const foundFood = currentUser.pantry.id(req.params.foodId);
    foundFood.set(req.body);
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/foods/${req.params.foodId}`);
  } catch (err) {
    console.log(err);
    res.redirect(`/users/${currentUser}/foods/${res.params.foodId}`);
  }
});

module.exports = router;
