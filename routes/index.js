var express = require("express");
var router = express.Router();
const passport = require("passport");
// This app has no "home" page, but your projects should 😀
router.get("/", function (req, res, next) {
  res.redirect("/movies");
});

router.get(
  "/auth/google", //which paossport strategy is being used?
  passport.authenticate("google", {
    scope: ["profile", "email"],
    //OPTIONAL - pick which account if multiple exist, 'magic' string
    prompt: "select_account",
  })
);
//where does user get directed?
router.get(
  "/oauth2callback",
  passport.authenticate("google", {
    successRedirect: "/movies",
    //change to whats best for your app
    failureRedirect: "/movies",
  })
);

router.get("/logout", function (req, res) {
  req.logout(function () {
    //change path to your 'landing page'
    res.redirect("/movies");
  });
});
module.exports = router;
