const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isPaidUser: { type: Boolean, default: false }, // Determines access
    stripeCustomerId: { type: String }, // Stores Stripe customer ID
});

module.exports = mongoose.model("User", UserSchema);