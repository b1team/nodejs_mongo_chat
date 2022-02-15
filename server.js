require("dotenv").config();

const express = require("express");
const cors = require("cors");
const apiConfig = require("./app/config/api.config");

const app = express();

var corsOptions = {
	origin: "*",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
db.mongoose
	.connect(db.url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Connected to the database!");
	})
	.catch((err) => {
		console.log("Cannot connect to the database!", err);
		process.exit();
	});

// simple route
app.get("/", (req, res) => {
	res.json({ message: "Welcome to chatapp" });
});

require("./app/routes/auth.routes")(app);
require("./app/routes/users.routes")(app);
require("./app/routes/rooms.routes")(app);
require("./app/routes/messages.routes")(app);
require("./app/routes/send_mess.routes")(app);



const wss = require("./websocket")

const server = require("http").createServer(app);

server.on('upgrade', function upgrade(request, socket, head) {
	const parser = require("url")
	const pathname = parser.parse(request.url, true).pathname;
	if (pathname === '/ws/chat') {
		wss.chatWS.handleUpgrade(request, socket, head, function done(ws) {
			wss.chatWS.emit('connection', ws, request);
		});
	} else if (pathname === '/ws/notifications') {
		wss.notifyWS.handleUpgrade(request, socket, head, function done(ws) {
			wss.notifyWS.emit('connection', ws, request);
		});
	}
	else {
		socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
		socket.destroy();
	}
});


const PORT = apiConfig.API_PORT;
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
})