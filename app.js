const express = require("express");
const path = require("path");
const app = express();
const PORT = 5000;

const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
    console.log("connected");
    
    socket.on("send-location", (data) => {
        io.emit("receive-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", () => {
        io.emit("user-disconnect", socket.id);
    });
});

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index");
});

server.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
