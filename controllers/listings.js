const Listing = require("../models/listing");
const getCoordinates = require("../utils/geocoding");
const { cloudinary } = require("../cloudConfig");

// ==========================
// INDEX
// ==========================
module.exports.index = async (req, res) => {
    const { search, category } = req.query;

    let filter = {};

    // Search
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } },
        ];
    }

    // Category Filter
    if (category && category !== "Trending") {
        filter.category = category;
    }

    const allListings = await Listing.find(filter);

    res.render("listings/index.ejs", {
        allListings,
        search,
        category,
    });
};

// ==========================
// NEW
// ==========================
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// ==========================
// SHOW
// ==========================
module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate("owner")
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        });

    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};

// ==========================
// CREATE
// ==========================
module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;

    const geometry = await getCoordinates(
        req.body.listing.location,
        req.body.listing.country
    );

    if (geometry) {
        newListing.geometry = geometry;
    }

    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }

    await newListing.save();

    req.flash("success", "New Listing Created Successfully!");
    res.redirect(`/listings/${newListing._id}`);
};

// ==========================
// EDIT
// ==========================
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });
};

// ==========================
// UPDATE
// ==========================
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.location = req.body.listing.location;
    listing.country = req.body.listing.country;
    listing.category = req.body.listing.category;

    const geometry = await getCoordinates(
        listing.location,
        listing.country
    );

    if (geometry) {
        listing.geometry = geometry;
    }

    if (req.file) {

        if (
            listing.image &&
            listing.image.filename &&
            listing.image.filename !== "listingimage"
        ) {
            await cloudinary.uploader.destroy(listing.image.filename);
        }

        listing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }

    await listing.save();

    req.flash("success", "Listing Updated Successfully!");

    res.redirect(`/listings/${listing._id}`);
};

// ==========================
// DELETE
// ==========================
module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    if (
        listing.image &&
        listing.image.filename &&
        listing.image.filename !== "listingimage"
    ) {
        await cloudinary.uploader.destroy(listing.image.filename);
    }

    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted Successfully!");

    res.redirect("/listings");
};