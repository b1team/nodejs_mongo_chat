module.exports = (app) => {
	const auth = require("../controllers/auth.controller");
	const messages = require("../controllers/messages.controller.js");

	var router = require("express").Router();

	// tao tin
	router.post("/", auth.verifyToken, messages.create);

	// Retrieve all Tutorials
	router.get("/room", auth.verifyToken, messages.getAllMessage);

	// sua tin
	router.put("/", auth.verifyToken, messages.updateMessage);

	// xoa message
	router.delete("/", auth.verifyToken, messages.deleteMessage);


	app.use("/messages", router);
};
