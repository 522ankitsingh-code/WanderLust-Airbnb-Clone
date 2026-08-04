const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review = require("./review");

const listingSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    image: {
      url: {
        type: String,
        default:
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      },
      filename: {
        type: String,
        default: "listingimage",
      },
    },

    price: {
      type: Number,
      min: 0,
    },

    location: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Trending",
        "Rooms",
        "Iconic Cities",
        "Mountains",
        "Castles",
        "Amazing Pools",
        "Camping",
        "Farms",
        "Arctic",
        "Domes",
        "Boats",
      ],
      default: "Trending",
    },

    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [77.2090, 28.6139],
      },
    },

    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    // ✅ Bookings
    bookings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Delete Reviews when Listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({
      _id: {
        $in: listing.reviews,
      },
    });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;