    require("dotenv").config();
    const express = require("express");
    const http = require("http");
    const cors = require("cors");
    const morgan = require("morgan");
    const helmet = require("helmet");
    const { Server } = require("socket.io");
    const connectDB = require("./config/db");

    const app = express();
    const server = http.createServer(app);
    const io = new Server(server, { cors: { origin: "*" } });

    // Middleware
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan("dev"));

    // DB connect
    connectDB();

    // Socket.io
    io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("disconnect", () => console.log("User disconnected:", socket.id));
    });

    // Routes
    app.use("/api/challenges", require("./routes/challengeRoutes"));
    app.use("/api/solutions", require("./routes/solutionRoutes"));
    app.use("/api/users", require("./routes/userRoutes"));

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
