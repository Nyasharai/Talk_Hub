const http = require("http");
const express = require("express");
const path = require('path');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
    console.log('A user connected');
    
    socket.on("set-username", (username) => {
        socket.username = username;
    });

    socket.on("user-message", (data) => {
        io.emit("message", { username: socket.username, message: data.message });
    });

    socket.on("file", (data) => {
        io.emit("message", { 
            username: socket.username, 
            file: { name: data.filename, url: data.content } 
        });
    });

    socket.on("typing", (data) => {
        socket.broadcast.emit("typing", { username: socket.username });
    });

    socket.on("disconnect", () => {
        console.log('User disconnected');
    });
});

app.use(express.static(path.resolve("./public")));

app.get("/", (req, res) => {
    return res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

server.listen(9000, () => console.log('Server Started at PORT:9000'));
