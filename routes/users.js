const express = require("express");
const passport = require("passport");

const router = express.Router();

const usersController = require("../controllers/users");
const { isLoggedIn } = require("../middleware");

// ==========================
// SIGNUP
// ==========================
router
  .route("/signup")
  .get(usersController.renderSignupForm)
  .post(usersController.signup);

// ==========================
// LOGIN
// ==========================
router
  .route("/login")
  .get(usersController.renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    usersController.login
  );

// ==========================
// HOST DASHBOARD
// ==========================
router.get(
  "/dashboard",
  isLoggedIn,
  usersController.dashboard
);

// ==========================
// LOGOUT
// ==========================
router.get("/logout", usersController.logout);

module.exports = router;