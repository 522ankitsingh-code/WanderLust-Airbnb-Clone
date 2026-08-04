require("dotenv").config();

const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("✅ Connected to Atlas");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("✅ Database Initialized");
    mongoose.connection.close();
};

main().then(initDB);