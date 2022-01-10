module.exports = (app) => {
	const messages = require("../controllers/messages.controller.js");

	var router = require("express").Router();

	// Create a new Tutorial
	router.post("/", messages.create);

	// Retrieve all Tutorials
	router.get("/", messages.findAll);

	// Retrieve all published Tutorials
	router.get("/seen", messages.findAllNotSeen);

	// Retrieve a single Tutorial with id
	router.get("/:id", messages.findOne);

	// Update a Tutorial with id
	router.put("/:id", messages.update);

	// Delete a Tutorial with id
	router.delete("/:id", messages.delete);

	// Create a new Tutorial
	router.delete("/", messages.deleteAll);

	app.use("/api/messages", router);
};
