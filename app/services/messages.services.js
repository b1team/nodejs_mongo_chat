const db = require("../models");
const Messages = db.messages;
const RoomMember = db.room_members
const userService = require("./user.services")
const roomService = require("./room.services")

module.exports.getLastMessage = function (room_id, callback) {
	Messages.findOne({ "room_id": room_id })
		.sort({ _id: -1 })
		.limit(1)
		.then((data) => {
			callback(null, data);
		})
		.catch((err) => {
            callback(null, err)});
};

module.exports.getMemberId = function(room_id, callback) {
	const listMemberId = []
	RoomMember.find({room_id: room_id}).then((members) => {
		for (let member of members) {
			listMemberId.push(member.member_id)
		}
		if (listMemberId.length == members.length) {
			callback(null, listMemberId)
			return;
		}
	}).catch((err) => callback(null, err))
}


module.exports.getAllMessage = function(room_id, callback) {
	const listMessage = [];
	const _user = {};
	Messages.find({room_id: room_id}).then((messages) => {
		if (messages.length == 0) return callback(null, messages);
		for (const message of messages) {
			if (_user[message.sender_id] === undefined) {
				userService.getUserInfo(message.sender_id, (err, user) => {
					if (err) {
						callback(null, err);
						return;
					}
					_user[message.sender_id] = user;

					if (_user[message.room_id] === undefined) {
						roomService.getRoomInfo(message.room_id, (err, room) => {
							if (err) {
								callback(null, err);
								return;
							}

							_user[message.room_id] = room;

							const data = message.toJSON();
							data["sender"] = _user[message.sender_id];
							data["room"] = _user[message.room_id];
							listMessage.push(data);

							if (listMessage.length == messages.length) {
								callback(null, listMessage);
								return;
							}
						});
					}
				});
			}
		}
	}).catch((err) => callback(null, err))
	
}