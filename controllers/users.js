const User = require("../models/user");
const Listing = require("../models/listing");
const Booking = require("../models/booking");

// ====================
// Signup Form
// ====================
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

// ====================
// Signup
// ====================
module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({
            username,
            email,
        });

        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);

            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listings");
        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

// ====================
// Login Form
// ====================
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// ====================
// Login
// ====================
module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    res.redirect("/listings");
};

// ====================
// HOST DASHBOARD
// ====================
module.exports.dashboard = async (req, res) => {

    // Listings created by the current user
    const listings = await Listing.find({
        owner: req.user._id,
    });

    const listingIds = listings.map(listing => listing._id);

    // Bookings for those listings
    const bookings = await Booking.find({
        listing: { $in: listingIds }
    })
        .populate("listing")
        .populate("user");

    // Total Earnings
    let totalEarnings = 0;

    bookings.forEach(booking => {
        if (booking.status === "Confirmed") {
            totalEarnings += booking.totalPrice;
        }
    });

    res.render("users/dashboard.ejs", {
        listings,
        bookings,
        totalEarnings,
    });
};

// ====================
// Logout
// ====================
module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }

        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });
};