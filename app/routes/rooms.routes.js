module.exports = (app) => {
	const rooms = require("../controllers/rooms.controller.js");

	var router = require("express").Router();

	// tao phong
	router.post("/", rooms.create);

	// moi thanh vien
	router.post("/invite", rooms.inviteMember);

	router.delete("/remove", rooms.removeMember);

	router.delete("/getout", rooms.getOutRoom);

	// Update phong
	router.put("/update", rooms.updateRoom);

	// lay thanh vien
	router.get("/members", rooms.getMembersRoom);

	// lay tat ca phong nguoi dung o
	router.get("/:user_id", rooms.findAll);

	// xoa phong
	router.delete("/:room_id", rooms.deleteRoom);

	app.use("/rooms", router);
};
