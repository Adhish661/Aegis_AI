const Log = require("./models/Log");
const Alert = require("./models/Alert");

function monitorTransactions(socket) {
  // Simulate transaction monitoring every 10s
  setInterval(async () => {
    const suspicious = Math.random() > 0.7; // 30% chance suspicious
    const userId = "64b0c1f2f2f2f2f2f2f2f2f2"; // Replace with actual userId

    if (suspicious) {
      console.log("🚨 Suspicious activity detected!");

      const log = await Log.create({
        userId,
        action: "TRANSACTION",
        status: "suspicious",
        details: "AI flagged unusual transaction",
      });

      const alert = await Alert.create({
        userId,
        type: "warning",
        message: "Suspicious transaction detected! Transactions may be frozen.",
      });

      socket.emit("alert", alert);
    } else {
      await Log.create({
        userId,
        action: "TRANSACTION",
        status: "normal",
        details: "Normal transaction",
      });
    }
  }, 10000);
}

module.exports = { monitorTransactions };


// const { freezeTransactions, rotateKey } = require("./wallet");
// const User = require("./models/User");

// // Mock AI check
// const detectSuspicious = (tx) => {
//     // Replace with AI API call
//     return tx.value > 10; // Mock: suspicious if tx > 10 ETH
// };

// const monitorTransactions = (socket) => {
//     setInterval(async () => {
//         const users = await User.find();
//         for (const user of users) {
//             // Mock transaction
//             const tx = { value: Math.random() * 20, user: user._id };

//             if (detectSuspicious(tx)) {
//                 socket.emit("alert", { type: "warning", message: "Suspicious activity detected!" });
//                 freezeTransactions(user._id);
//                 const newKey = await rotateKey(user._id);
//                 socket.emit("alert", { type: "info", message: "Private key rotated", newKey });
//             }
//         }
//     }, 5000); // every 5 seconds
// };

// module.exports = { monitorTransactions };
