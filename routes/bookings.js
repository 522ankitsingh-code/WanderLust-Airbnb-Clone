const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const bookingController = require("../controllers/bookings");

const { isLoggedIn } = require("../middleware");

// ==========================
// CREATE BOOKING
// ==========================
router.post(
    "/:id",
    isLoggedIn,
    wrapAsync(bookingController.createBooking)
);

// ==========================
// MY BOOKINGS
// ==========================
router.get(
    "/",
    isLoggedIn,
    wrapAsync(bookingController.myBookings)
);

// ==========================
// CANCEL BOOKING
// ==========================
router.put(
    "/:bookingId/cancel",
    isLoggedIn,
    wrapAsync(bookingController.cancelBooking)
);

module.exports = router;