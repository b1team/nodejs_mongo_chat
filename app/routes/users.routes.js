module.exports = (app) => {
	const auth = require("../controllers/auth.controller");
	const users = require("../controllers/users.controller.js");

	var router = require("express").Router();

	router.get("/me", auth.verifyToken, users.findMe);

	// tao user
	router.post("/", users.create);

	// tim theo username
	router.get("/:username", auth.verifyToken, users.findOne);

	// update theo id
	router.put("/", auth.verifyToken, users.update);


	app.use("/users", router);
};
