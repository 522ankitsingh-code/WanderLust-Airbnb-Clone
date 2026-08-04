require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const ExpressError = require("./utils/ExpressError");

const listingRouter = require("./routes/listings");
const reviewRouter = require("./routes/reviews");
const userRouter = require("./routes/users");
const bookingRouter = require("./routes/bookings"); // ✅ NEW

const User = require("./models/user");
const Listing = require("./models/listing");

const app = express();

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// =====================
// MongoDB Connection
// =====================
async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB Connected");
}

main().catch((err) => console.log(err));

// =====================
// View Engine
// =====================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// =====================
// Middleware
// =====================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// =====================
// Session
// =====================
const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
};

app.use(session(sessionOptions));
app.use(flash());

// =====================
// Passport
// =====================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// =====================
// Global Variables
// =====================
app.use((req, res, next) => {
    res.locals.currUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.search = req.query.search || "";
    next();
});

// =====================
// Home Route
// =====================
app.get("/", (req, res) => {
    res.redirect("/listings");
});

// =====================
// Routes
// =====================
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/bookings", bookingRouter); // ✅ NEW
app.use("/", userRouter);

// =====================
// Temporary Debug Route
// =====================
app.get("/check", async (req, res) => {
    const listings = await Listing.find({});
    res.json(listings);
});

// =====================
// 404 Handler
// =====================
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// =====================
// Error Handler
// =====================
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something Went Wrong!" } = err;
    console.error(err);
    res.status(statusCode).send(message);
});

// =====================
// Server
// =====================
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});