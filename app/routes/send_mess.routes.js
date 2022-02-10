module.exports = (app) => {
	const auth = require("../controllers/auth.controller");
	const sendMess = require("../controllers/send_mess.controller");

	var router = require("express").Router();

	router.post("/send_message", auth.verifyToken, sendMess.senMessage);

	app.use("/message_management", router);
};
