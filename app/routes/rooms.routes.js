module.exports = (app) => {
	const rooms = require("../controllers/rooms.controller.js");

	var router = require("express").Router();

	// Create a new Tutorial
	router.post("/", rooms.create);

	// Retrieve all Tutorials
	router.get("/", rooms.findAll);

	// Retrieve all published Tutorials
	router.get("/private", rooms.findAllPrivate);

	// Retrieve a single Tutorial with id
	router.get("/:id", rooms.findOne);

	// Update a Tutorial with id
	router.put("/:id", rooms.update);

	// Delete a Tutorial with id
	router.delete("/:id", rooms.delete);

	// Create a new Tutorial
	router.delete("/", rooms.deleteAll);

	app.use("/api/rooms", router);
};
