const db = require("../models");
const Room = db.rooms;

// Create and Save a new Room
exports.create = (req, res) => {
	// Validate request
	if (!req.body.room_name) {
		res.status(400).send({ message: "Room name can not be empty!" });
		return;
	}

	// Create a Room
	const room = new Room({
		room_name: req.body.room_name,
	});

	// Save Room in the database
	room
		.save(room)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || "Some error occurred while creating the Room.",
			});
		});
};

// Retrieve all Rooms from the database.
exports.findAll = (req, res) => {
	const room_name = req.query.room_name;
	var condition = room_name ? { room_name: { $regex: new RegExp(room_name), $options: "i" } } : {};

	Room.find(condition)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || "Some error occurred while retrieving rooms.",
			});
		});
};

// Find a single Room with an id
exports.findOne = (req, res) => {
	const id = req.params.id;

	Room.findById(id)
		.then((data) => {
			if (!data) res.status(404).send({ message: "Not found Room with id " + id });
			else res.send(data);
		})
		.catch((err) => {
			res.status(500).send({ message: "Error retrieving Room with id=" + id });
		});
};

// Update a Room by the id in the request
exports.update = (req, res) => {
	if (!req.body) {
		return res.status(400).send({
			message: "Data to update can not be empty!",
		});
	}

	const id = req.params.id;

	Room.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
		.then((data) => {
			if (!data) {
				res.status(404).send({
					message: `Cannot update Room with id=${id}. Maybe Room was not found!`,
				});
			} else res.send({ message: "Room was updated successfully." });
		})
		.catch((err) => {
			res.status(500).send({
				message: "Error updating Room with id=" + id,
			});
		});
};

// Delete a Room with the specified id in the request
exports.delete = (req, res) => {
	const id = req.params.id;

	Room.findByIdAndRemove(id, { useFindAndModify: false })
		.then((data) => {
			if (!data) {
				res.status(404).send({
					message: `Cannot delete Room with id=${id}. Maybe Room was not found!`,
				});
			} else {
				res.send({
					message: "Room was deleted successfully!",
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: "Could not delete Room with id=" + id,
			});
		});
};

// Delete all Rooms from the database.
exports.deleteAll = (req, res) => {
	Room.deleteMany({})
		.then((data) => {
			res.send({
				message: `${data.deletedCount} Rooms were deleted successfully!`,
			});
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || "Some error occurred while removing all rooms.",
			});
		});
};

// Find all published Rooms
exports.findAllPrivate = (req, res) => {
	Room.find({ type: 'private' })
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || "Some error occurred while retrieving rooms.",
			});
		});
};
