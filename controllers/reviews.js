const Listing = require("../models/listing");
const Review = require("../models/review");

// ==========================
// Create Review
// ==========================
module.exports.createReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    const newReview = new Review(req.body.review);

    // Save logged-in user as review author
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "Review Added Successfully!");

    res.redirect(`/listings/${listing._id}`);
};

// ==========================
// Delete Review
// ==========================
module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId },
    });

    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted Successfully!");

    res.redirect(`/listings/${id}`);
};