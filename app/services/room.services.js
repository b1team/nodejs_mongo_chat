const db = require("../models");
const RoomMember = db.room_members;
const Room = db.rooms;
const userService = require("./user.services");
const messageService = require("./messages.services");
const dateFormat = require("../utils/datetime.utils");
const Messages = db.messages;

module.exports.inviteMember = function (data, callback) {
	userService.getUser(data.member_name, (err, user) => {
		if(err) {
			callback(null, err);
			return;
		}
		RoomMember.findOne({ room_id: data.room_id, member_id: user.user_id }, (err, member) => {
			if (err) {
				callback(null, err);
				return;
			}
			if (member) {
				callback(null, member.toJSON());
				return;
			}

			const room_member = new RoomMember({
				room_id: data.room_id,
				member_id: user.user_id,
				is_owner: data.is_owner,
			});

			room_member
				.save(room_member)
				.then((data) => {
					callback(null, data.toJSON());
				})
				.catch((err) => callback(null, err));
		});
	});
};

module.exports.inRoom = function (user_id, callback) {
	const listRoom = [];
	RoomMember.find({ member_id: user_id }).then((data) => {
		if (data.length == 0) callback(null, data);
		const length_break = data.length;
		for (const info of data) {
			Room.findById(info.room_id)
				.then((room) => {
					const data = JSON.parse(JSON.stringify(room));
					messageService.getLastMessage(info.room_id, (err, lastMessage) => {
						if (err) {
							callback(null, err);
							return;
						}
						try {
							const messageLast = JSON.parse(JSON.stringify(lastMessage));
							messageLast["timestamp"] = dateFormat.date_format(
								messageLast["created_at"]
							);
							data["last_message"] = messageLast == null ? {} : messageLast;
						} catch (error) {
							const messageLast = {};
							messageLast['content'] = "";
							messageLast["timestamp"] = dateFormat.date_format(new Date().toISOString());
							data["last_message"] = messageLast == null ? {} : messageLast;
						}

						listRoom.push(data);
						if (listRoom.length == length_break) {
							callback(null, listRoom);
						}
					});
				})
				.catch((error) => callback(null, error));
		}
	});
};

module.exports.roomDelete = function (room_id, callback) {
	Messages.deleteMany({ room_id: room_id })
		.then((data) => {
			RoomMember.deleteMany({ room_id: room_id })
				.then((data) => {
					callback(null, { success: true });
				})
				.catch((err) => callback(null, { success: false }));
		})
		.catch((error) => callback(null, { success: false }));
};

module.exports.checkMemberExists = function (info, callback) {
	userService.getUser(info.member_name, (err, user) => {
		if (err) {
			callback(null, err);
			return;
		}
		if (user == null) {
			callback(null, true);
			return;
		}
		RoomMember.findOne({ member_id: user.user_id, room_id: info.room_id }).then((data) => {
			if (data == null) {
				callback(null, false);
				return;
			}
			callback(null, true);
		});
	});
};

module.exports.removeMember = function (info, callback) {
	userService.getUser(info.member_name, (err, user) => {
		if (err) {
			callback(null, err);
			return;
		}
		if (user == null) {
			callback(null, null);
			return;
		}
		RoomMember.deleteOne({ member_id: user.user_id, room_id: info.room_id }).then((data) => {
			if (!data) {
				callback(null, null);
				return;
			}
			callback(null,  user.user_id );
		});
	});
};

module.exports.checkAdmin = function (info, callback) {
	RoomMember.findOne({ room_id: info.room_id, member_id: info.user_id }).then((data) => {
		if (data.is_owner) {
			callback(null, true);
			return;
		}
		callback(null, false);
	});
};

module.exports.getMembers = function (room_id, callback) {
	const listMember = [];
	RoomMember.find({ room_id: room_id })
		.then((data) => {
			if (data.length == 0) {
				callback(null, data);
				return;
			}
			for (const member of data) {
				userService.getUserById(member.member_id, (err, user) => {
					if (err) {
						callback(null, err);
						return;
					}
					_user = user;
					_user["is_owner"] = member.is_owner;
					listMember.push(_user);

					if (listMember.length == data.length) {
						callback(null, listMember);
						return;
					}
				});
			}
		})
		.catch((err) => {
			callback(null, err);
		});
};


module.exports.getRoomInfo = function(id, callback) {
	Room.findById(id).then((room) => {
		const filter = {
			id: room._id,
			type: room.type,
			room_name: room.room_name,
			display_name: room.display_name,
			avatar: room.avatar,
		};
		callback(null, filter)
	}).catch((err) => {callback(null, err);});
}