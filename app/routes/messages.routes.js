module.exports = (app) => {
	const messages = require("../controllers/messages.controller.js");

	var router = require("express").Router();

	// tao tin
	router.post("/", messages.create);

	// Retrieve all Tutorials
	router.get("/room", messages.getAllMessage);

	// sua tin
	router.put("/", messages.updateMessage);

	// xoa message
	router.delete("/", messages.deleteMessage);


	app.use("/messages", router);
};
