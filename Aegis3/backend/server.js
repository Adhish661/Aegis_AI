require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");   // must exist
const { monitorTransactions } = require("./transactionMonitor"); // must exist

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use("/api/users", userRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB error:", err));

// Socket.io connection
io.on("connection", (socket) => {
    console.log("Client connected");

    // Start monitoring transactions for this client
    monitorTransactions(socket);

    socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(5000, () => console.log("🚀 Server running on port 5000"));


// require("dotenv").config();
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const mongoose = require("mongoose");
// const userRoutes = require("./routes/userRoutes");
// const { monitorTransactions } = require("./transactionMonitor");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });

// app.use(express.json());
// app.use("/api/users", userRoutes);

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log("MongoDB connected"))
//     .catch(err => console.log(err));

// // Socket.io connection
// io.on("connection", (socket) => {
//     console.log("Client connected");

//     // Start monitoring transactions for this client
//     monitorTransactions(socket);

//     socket.on("disconnect", () => console.log("Client disconnected"));
// });

// server.listen(5000, () => console.log("Server running on port 5000"));
