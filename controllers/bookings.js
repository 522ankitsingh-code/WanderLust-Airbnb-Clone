const Booking = require("../models/booking");
const Listing = require("../models/listing");

// ==========================
// CREATE BOOKING
// ==========================
module.exports.createBooking = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    const { checkIn, checkOut, guests } = req.body;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Number of nights
    const totalNights = Math.ceil(
        (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );

    if (totalNights <= 0) {
        req.flash("error", "Check-out date must be after check-in date.");
        return res.redirect(`/listings/${id}`);
    }

    const totalPrice = totalNights * listing.price;

    const booking = new Booking({
        listing: listing._id,
        user: req.user._id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        totalPrice,
    });

    await booking.save();

    listing.bookings.push(booking._id);
    await listing.save();

    req.flash("success", "Booking Confirmed Successfully!");

    res.redirect("/bookings");
};

// ==========================
// MY BOOKINGS
// ==========================
module.exports.myBookings = async (req, res) => {

    const bookings = await Booking.find({
        user: req.user._id,
    }).populate("listing");

    res.render("bookings/index.ejs", { bookings });
};

// ==========================
// CANCEL BOOKING
// ==========================
module.exports.cancelBooking = async (req, res) => {

    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        req.flash("error", "Booking not found!");
        return res.redirect("/bookings");
    }

    booking.status = "Cancelled";

    await booking.save();

    req.flash("success", "Booking Cancelled Successfully!");

    res.redirect("/bookings");
};