const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");
const Listing = require("./models/listing");

// ==========================
// Validate Listing
// ==========================
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }

    next();
};

// ==========================
// Validate Review
// ==========================
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }

    next();
};

// ==========================
// Check Login
// ==========================
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in first!");
        return res.redirect("/login");
    }

    next();
};

// ==========================
// Check Listing Owner
// ==========================
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission to do this!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};