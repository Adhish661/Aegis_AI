const express = require("express");
const router = express.Router();
const Log = require("../models/Log");
const Alert = require("../models/Alert");

// Example: Get all logs
router.get("/logs", async (req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Example: Get all alerts
router.get("/alerts", async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;



// const express = require("express");
// const router = express.Router();
// const { createWallet } = require("../wallet");
// const User = require("../models/User");

// // Register user
// router.post("/register", async (req, res) => {
//     const { name, email } = req.body;
//     const wallet = await createWallet();
//     const user = await User.create({ name, email, privateKey: wallet.privateKey });
//     res.json({ userId: user._id, address: wallet.address });
// });

// module.exports = router;
