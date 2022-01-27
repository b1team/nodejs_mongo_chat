module.exports = (app) => {
	const sendMess = require("../controllers/send_mess.controller");

	var router = require("express").Router();

	router.post("/send_message", sendMess.senMessage);

	app.use("/message_management", router);
};
