const db = require("../models");
const Message = db.messages;
const messageService = require("../services/messages.services");
const redis = require("../services/redis.services");

exports.senMessage = (req, res) => {
    if (!req.body.content) {
		res.status(400).send({ message: "Content can not be empty!" });
		return;
	}
    const username = req.body.username; // lay tu auth
	// Create a Message
	const message = new Message({
		content: req.body.content,
		sender_id: req.body.sender_id, // user_id lay tu auth
		room_id: req.body.room_id,
	});

    const room_id = req.body.room_id;
    const sender_id = req.body.sender_id;

    message
		.save(message)
		.then((data) => {
			const message = data.toJSON();
            message['username'] = username
            const event = { event_type: "new_message", payload: message };
            messageService.getMemberId(room_id, (err, members) => {
                if (err) {
                    res.status(404).send(err);
                    return;
                }
                for (const member of members) {
                    if (member != sender_id){
                        redis.publish(channel=member, event=event)
                    }
                }
            })
            res.send(message)
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || "Some error occurred while creating the Message.",
			});
		});
}