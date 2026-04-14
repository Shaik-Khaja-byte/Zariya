const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DEFAULT_IMAGE = "https://plus.unsplash.com/premium_photo-1707028749325-1c3f48c15cee?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        trim: true,
    },

    image: {
        type: String,
        default: DEFAULT_IMAGE,
        set: (v) => {
            // If image is an object like { url, filename }, extract the URL
            if (v && typeof v === "object" && v.url) {
                return v.url;
            }
            // If empty or undefined, use default image
            if (!v || v === "") {
                return DEFAULT_IMAGE;
            }
            // Otherwise, return the string URL
            return v;
        }
    },

    price: {
        type: Number,
        min: 0,
        default: 0,
    },

    location: {
        type: String,
        trim: true,
    },

    country: {
        type: String,
        trim: true,
    }
}, { timestamps: true });

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;