const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true }, // e.g. "TRANSACTION", "FREEZE", "ROTATE_KEY"
    status: { type: String, enum: ["normal", "suspicious", "blocked"], default: "normal" },
    details: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", LogSchema);
