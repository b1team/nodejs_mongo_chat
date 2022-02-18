const db = require("../models");
const Message = db.messages;
const messageService = require("../services/messages.services");
const strip = require("../utils/trim.utils");
const redis = require("redis");

// Tao tin nhan
exports.create = (req, res) => {
	// Validate request
	if (strip.strip(req.body.content).length == 0) {
		res.status(400).send({ message: "Content can not be empty!" });
		return;
	}

	// Create a Message
	const message = new Message({
		content: req.body.content,
		sender_id: req.user.user_id,
		room_id: req.body.room_id,
	});

	// Save Message in the database
	message
		.save(message)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || "Some error occurred while creating the Message.",
			});
		});
};

// Lay messages
exports.getAllMessage = (req, res) => {
	const room_id = req.query.room_id;

	messageService.getAllMessage(room_id, (err, _messages) => {
		if (err) {
			res.status(404).send(err);
			return;
		}
		res.send({ messages: _messages, count: _messages.length });
	});
};

// Update a Message by the id in the request
exports.updateMessage = (req, res) => {
	if (!req.body) {
		return res.status(400).send({
			message: "Data to update can not be empty!",
		});
	}

	const filter = {
		sender_id: req.user.user_id,
		_id: req.body.message_id,
	};

	const update = {
		content: req.body.content,
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

	Message.findOneAndUpdate(filter, update, { useFindAndModify: false, new: true })
		.then((data) => {
			if (!data) {
				res.status(404).send({
					message: `Cannot update Message. Maybe Message was not found!`,
				});
			} else {
				messageService.getMemberId(req.body.room_id, (err, members) => {
					if (err) {
						res.status(404).send(err);
						return;
					}
					for (const member of members) {
						const event = {
							event_type: "update",
							payload: {
								room_id: req.body.room_id,
								content: req.body.content,
								message_id: req.body.message_id,
							},
						};
						const channel = `${member}_notify`;
						publisher
							.publish(channel.toString(), JSON.stringify(event))
							.then((value) => {
								console.log(`Publish update message to ${channel} success!`);
							})
							.catch((err) => {
								console.error("PUBLISH UPDATE MESSAGE ERROR: " + err);
							});
					}
					res.send({ success: true });
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: "Error updating Message",
				error: err,
			});
		});
};

// Delete a Message with the specified id in the request
exports.deleteMessage = (req, res) => {
	const filter_del = {
		_id: req.body.message_id,
		sender_id: req.user.user_id,
	};

	const room_id = req.body.room_id;
	const index = req.body.index;

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

	Message.findOneAndDelete(filter_del)
		.then((data) => {
			if (!data) {
				res.status(404).send({
					message: `Cannot delete Message. Maybe Message was not found!`,
				});
			} else {
				messageService.getMemberId(room_id, (err, members) => {
					if (err) {
						res.status(404).send(err);
						return;
					}
					members.forEach((member) => {
						if (member.toString() !== filter_del.sender_id){
							const event = {
								event_type: "delete_mess",
								payload: {
									room_id: room_id,
									message_id: filter_del._id,
									index: index,
								},
							};
							const channel = `${member}_notify`;
							publisher
								.publish(channel.toString(), JSON.stringify(event))
								.then((value) => {
									console.log(`Publish delete message to ${channel} success!`);
								})
								.catch((err) => {
									console.error("PUBLISH UPDATE MESSAGE ERROR: " + err);
								});
						}
					})
					res.send({ success: true });
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: "Could not delete Message with",
			});
		});
};
