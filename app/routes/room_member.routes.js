module.exports = (app) => {
	const room_member = require("../controllers/room_member.controller.js");

	var router = require("express").Router();

	// Create a new Tutorial
	router.post("/", room_member.create);

	// Retrieve all Tutorials
	router.get("/", room_member.findAll);

	// Retrieve all owner Tutorials
	router.get("/owner", room_member.findAllOwners);

	// Retrieve a single Tutorial with id
	router.get("/:id", room_member.findOne);

	// Update a Tutorial with id
	router.put("/:id", room_member.update);

	// Delete a Tutorial with id
	router.delete("/:id", room_member.delete);

	// Create a new Tutorial
	router.delete("/", room_member.deleteAll);

	app.use("/api/member", router);
};
