const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String, // hashed
    privateKey: String,
    frozen: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", userSchema);
