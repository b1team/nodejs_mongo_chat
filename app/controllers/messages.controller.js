const db = require("../models");
const Message = db.messages;
const messageService = require("../services/messages.services");
const redis = require("../services/redis.services");

// Tao tin nhan
exports.create = (req, res) => {
	// Validate request
	if (!req.body.content) {
		res.status(400).send({ message: "Content can not be empty!" });
		return;
	}

	// Create a Message
	const message = new Message({
		content: req.body.content,
		sender_id: req.body.sender_id,
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

	Message.find({room_id: room_id})
		.then((messages) => {
			messageService.getAllMessage(messages, (err, _messages) => {
				if (err) {
					res.status(404).send(err);
					return;
				}
				res.send({ messages: _messages, count: _messages.length });
			})
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || "Some error occurred while retrieving messages.",
			});
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
		sender_id: req.body.sender_id,
		_id: req.body.message_id,
	};

	const update = {
		content: req.body.content,
	};

	Message.findOneAndUpdate(filter, update, {new: true })
		.then((data) => {
			if (!data) {
				res.status(404).send({
					message: `Cannot update Message. Maybe Message was not found!`,
				});
			} else {
				messageService.getMemberId(data.room_id, (err, members) => {
					for (const member of members) {
						if (member != filter.sender_id) {
							const event = {
								event_type: "update",
								payload: {
									room_id: data.room_id,
									content: data.content,
									message_id: data.message_id,
								},
							};
							const channel = `${member}_notify`;
							console.log(event);
							redis.publish(channel=channel,event=event)
						}
					}
					res.send({ success: true });
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: "Error updating Message",
				error: err
			});
		});
};

// Delete a Message with the specified id in the request
exports.deleteMessage = (req, res) => {
	const filter_del = {
		message_id: req.body.message_id,
		sender_id: req.body.sender_id
	}
	const room_id = req.body.room_id
	const index = req.body.index

	Message.findOneAndDelete(filter_del)
		.then((data) => {
			if (!data) {
				res.status(404).send({
					message: `Cannot delete Message. Maybe Message was not found!`,
				});
			} else {
				messageService.getMemberId(room_id, (err, members) => {
					for (const member of members) {
						if (member != filter.sender_id) {
							const event = {
								event_type: "delete_mess",
								payload: {
									room_id: room_id,
									message_id: filter_del.message_id,
									index: index,
								},
							};
							const channel = `${member}_notify`;
							console.log(event);
							redis.publish((channel = channel), (event = event));
						}
					}
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
