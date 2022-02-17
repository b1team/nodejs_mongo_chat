const db = require("../models");
const Room = db.rooms;
const userService = require("../services/user.services");
const roomService = require("../services/room.services");
const strip = require("../utils/trim.utils");
const messageService = require("../services/messages.services");

const redis = require("redis");

// Create and Save a new Room
exports.create = (req, res) => {
	// Validate request
	if (!req.query.room_name) {
		res.status(400).send({ message: "Room name can not be empty!" });
		return;
	}
	if (strip.strip(req.query.room_name).length == 0) {
		res.status(404).send({ message: "room name is required" });
		return;
	}

	// Create a Room
	const room = new Room({
		room_name: req.query.room_name,
	});

	const user_id = req.user.user_id;
	if (!user_id) {
		res.status(404).send({ message: "user_id is required" });
		return;
	}

	userService.getUserById(user_id, (err, user) => {
		if (err) {
			console.log("err", err);
			res.status(404).send({"message": "Create room failed"});
		}
		room.save(room)
			.then((data) => {
				const info = {
					room_id: room.id,
					member_name: user.username,
					is_owner: true,
				};

				roomService.inviteMember(info, (err, member) => {
					if (err) {
						res.status(404).send(err);
					}
					res.send({ room: data, owner: user });
				});
			})
			.catch((err) => {
				res.status(500).send({
					message: err.message || "Some error occurred while creating the Room.",
				});
			});
	});
};

// Lay user o
exports.loadAllRooms = (req, res) => {
	const user_id = req.user.user_id;
	roomService.inRoom(user_id, (err, rooms) => {
		if (err) {
			res.status(404).send(err);
		}
		res.send({ rooms: rooms, count: rooms.length });
	});
};

exports.inviteMember = (req, res) => {
	const info = {
		room_id: req.body.room_id,
		member_name: req.body.member_name,
		is_owner: false,
	};

	const checkExist = {
		room_id: req.body.room_id,
		member_name: req.body.member_name,
	};

	const publisher = redis.createClient({ url: process.env.REDIS_URL });
	publisher
		.connect()
		.then(() => {
			console.log("Connected to Redis " + process.env.REDIS_URL);
		})
		.catch((err) => {
			console.error("CONNECT TO REDIS ERROR: " + err);
			return;
		});

	roomService.checkMemberExists(checkExist, (err, member) => {
		if (err) {
			console.log("err", err);
			res.status(404).send(err);
			return;
		}
		if (member) {
			res.status(400).send({
				message: "Member in room already exists or user is unauthenticated",
			});
			return;
		}
		roomService.inviteMember(info, (err, member) => {
			if (err) {
				res.status(404).send(err);
				return;
			}

			const event = { event_type: "invite", payload: { room_id: info.room_id } };
			const user_id = member.member_id;
			const channel = `${user_id}_notify`;
			publisher
				.publish(channel.toString(), JSON.stringify(event))
				.then((value) => {
					console.log("INVITE MEMBER SUCCESS");
				})
				.catch((err) => {
					console.log("INVITE ERROR: " + err);
				});
			res.send(member);
		});
	});
};

exports.removeMember = (req, res) => {
	const info = {
		room_id: req.body.room_id,
		member_name: req.body.member_name,
	};

	const data = {
		room_id: req.body.room_id,
		user_id: req.user.user_id,
	};

	const publisher = redis.createClient({ url: process.env.REDIS_URL });
	publisher
		.connect()
		.then(() => {
			console.log("Connected to Redis " + process.env.REDIS_URL);
		})
		.catch((err) => {
			console.error("CONNECT TO REDIS ERROR: " + err);
			return;
		});

	roomService.checkAdmin(data, (err, admin) => {
		if (err) {
			res.status(404).send(err);
			return;
		}
		if (!admin) {
			res.status(400).send({ message: "You are not admin" });
			return;
		}

		roomService.removeMember(info, (err, member) => {
			if (err) {
				res.status(400).send("Cannot remove member");
				return;
			}
			const event = { event_type: "delete", payload: { room_id: info.room_id } };
			const channel = `${member}_notify`;
			publisher
				.publish(channel.toString(), JSON.stringify(event))
				.then((value) => {
					console.log("REMOVE MEMBER SUCCESS");
				})
				.catch((err) => {
					console.log("REMOVE MEMBER ERROR: " + err);
				});
			res.send({ success: true });
		});
	});
};

// Cap nhap phong
exports.updateRoom = (req, res) => {
	if (!req.body) {
		return res.status(400).send({
			message: "Data to update can not be empty!",
		});
	}

	const room_id = req.body.room_id;

	const info = {
		room_name: strip.strip(req.body.room_name),
		avatar: strip.strip(req.body.avatar),
	};

	if (info.room_name == "") {
		res.status(400).send({ message: "Room name and avatar is required" });
		return;
	}

	Room.findByIdAndUpdate(room_id, info, { useFindAndModify: false, new: true })
		.then((data) => {
			if (!data) {
				res.status(404).send({
					message: `Cannot update Room with id=${room_id}. Maybe Room was not found!`,
				});
			} else {
				_room = {
					room_id: data._id,
					room_name: data.room_name,
					avatar: data.avatar,
				}
				res.send({ room: _room });
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: "Error updating Room with id=" + room_id,
			});
		});
};

// xoa phong
exports.deleteRoom = (req, res) => {
	const id = req.query.room_id;
	const publisher = redis.createClient({ url: process.env.REDIS_URL });
	publisher
		.connect()
		.then(() => {
			console.log("Connected to Redis " + process.env.REDIS_URL);
		})
		.catch((err) => {
			console.error("CONNECT TO REDIS ERROR: " + err);
			return;
		});
	// code kiem tra admin o day
	roomService.roomDelete(id, (err, statuss) => {
		if (err) {
			res.status(500).send({ success: false });
			return;
		}
		Room.findByIdAndRemove(id, { useFindAndModify: false })
			.then((data) => {
				if (!data) {
					res.status(404).send({
						message: `Cannot delete Room with id=${id}. Maybe Room was not found!`,
					});
				} else {
					const event = { event_type: "delete", payload: { room_id: id } };
					messageService.getMemberId(id, (err, members) => {
						if (err) {
							res.status(404).send(err);
							return;
						}

						for (const member of members) {
							const channel = `${member}_notify`;
							publisher
								.publish(channel.toString(), JSON.stringify(event))
								.then((value) => {
									console.log(`PUBLISH DELETE ROOM TO ${channel} success!`);
								})
								.catch((err) => {
									console.error("PUBLISH UPDATE MESSAGE ERROR: " + err);
								});
						}
						res.send(statuss);
					});
				}
			})
			.catch((err) => {
				console.log("DELETE ROOM ERROR", err);
				res.status(500).send({
					message: "Could not delete Room with id=" + id,
				});
			});
	});
};

exports.getOutRoom = (req, res) => {
	// kiem tra admin o day
	const info = {
		room_id: req.body.room_id,
		member_name: req.body.member_name,
	};
	const publisher = redis.createClient({ url: process.env.REDIS_URL });
	publisher
		.connect()
		.then(() => {
			console.log("Connected to Redis " + process.env.REDIS_URL);
		})
		.catch((err) => {
			console.error("CONNECT TO REDIS ERROR: " + err);
			return;
		});
	// code kiem tra admin o day
	roomService.removeMember(info, (err, member) => {
		if (err) {
			res.status(400).send("Cannot get out room");
			return;
		}
		const event = { event_type: "delete", payload: { room_id: info.room_id } };
		const channel = `${member}_notify`;
		publisher
			.publish(channel.toString(), JSON.stringify(event))
			.then((value) => {
				console.log("GETOUT SUCCESS");
			})
			.catch((err) => {
				console.log("GETOUT ERROR: " + err);
			});
		res.send({ success: true });
	});
};

exports.getMembersRoom = (req, res) => {
	const room_id = req.query.room_id;
	roomService.getMembers(room_id, (err, members) => {
		if (err) {
			res.status(404).send(err);
			return;
		}
		res.send({ members: members });
	});
};
