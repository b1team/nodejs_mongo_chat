module.exports = (app) => {
	const auth = require("../controllers/auth.controller");
	const rooms = require("../controllers/rooms.controller.js");

	var router = require("express").Router();

	// tao phong
	router.post("/", auth.verifyToken, rooms.create);

	// moi thanh vien
	router.post("/invite", auth.verifyToken, rooms.inviteMember);

	router.delete("/remove", auth.verifyToken, rooms.removeMember);

	router.delete("/getout", auth.verifyToken, rooms.getOutRoom);

	// Update phong
	router.put("/update", auth.verifyToken, rooms.updateRoom);

	// lay thanh vien
	router.get("/members", auth.verifyToken, rooms.getMembersRoom);

	// lay tat ca phong nguoi dung o
	router.get("/", auth.verifyToken, rooms.loadAllRooms);

	// xoa phong
	router.delete("/", auth.verifyToken, rooms.deleteRoom);

	app.use("/rooms", router);
};
