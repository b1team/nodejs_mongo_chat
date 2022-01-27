module.exports = (app) => {
	const users = require("../controllers/users.controller.js");

	var router = require("express").Router();

	// router.get("/users/me")

	// tao user
	router.post("/", users.create);

	// tim theo username
	router.get("/:username", users.findOne);

	// update theo id
	router.put("/:id", users.update);


	app.use("/users", router);
};
