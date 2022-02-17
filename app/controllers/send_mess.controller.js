const db = require("../models");
const Message = db.messages;
const messageService = require("../services/messages.services");
const strip = require("../utils/trim.utils");
const redis = require("redis");

exports.senMessage = (req, res) => {
	if (strip.strip(req.body.content).length == 0) {
		res.status(400).send({ message: "Content can not be empty!" });
		return;
	}
	const username = req.user.username; // lay tu auth
	// Create a Message
	const message = new Message({
		content: req.body.content,
		sender_id: req.user.user_id, // user_id lay tu auth
		room_id: req.body.room_id,
	});

	const room_id = req.body.room_id;
	const sender_id = req.user.user_id;

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
	message
		.save(message)
		.then((data) => {
			const message = data.toJSON();
			message["username"] = username;
			const event = { event_type: "new_message", payload: message };
			messageService.getMemberId(room_id, (err, members) => {
				if (err) {
					res.status(404).send(err);
					return;
				}
				members.forEach((member) => {
					publisher
						.publish(member.toString(), JSON.stringify(event))
						.then((value) => {
							console.info("Sent message to: ", member);
						})
						.catch((err) => {
							console.error("Error: ", err);
						});
				});
			});
			res.send(message);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || "Some error occurred while creating the Message.",
			});
		});
};
