const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");
const reviewController = require("../controllers/reviews");

const {
  isLoggedIn,
  validateReview,
} = require("../middleware");

// ==========================
// CREATE REVIEW
// ==========================
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// ==========================
// DELETE REVIEW
// ==========================
router.delete(
  "/:reviewId",
  isLoggedIn,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;