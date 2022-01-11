const db = require("../models");
const RoomMember = db.room_members;

// Create and Save a new RoomMember
exports.create = (req, res) => {
	// Validate request
	if (!req.body.room_id) {
		res.status(400).send({ message: "room_id can not be empty!" });
		return;
	}

	// Create a RoomMember
	const member = new RoomMember({
		room_id: req.body.room_id,
		member_id: req.body.member_id,
	});

	// Save RoomMember in the database
	member
		.save(member)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || "Some error occurred while creating the RoomMember.",
			});
		});
};

// Retrieve all RoomMembers from the database.
exports.findAll = (req, res) => {
	const room_id = req.query.room_id;
	var condition = room_id ? { room_id: { $regex: new RegExp(room_id), $options: "i" } } : {};

	RoomMember.find(condition)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || "Some error occurred while retrieving members.",
			});
		});
};

// Find a single RoomMember with an id
exports.findOne = (req, res) => {
	const id = req.params.id;

	RoomMember.findById(id)
		.then((data) => {
			if (!data) res.status(404).send({ message: "Not found RoomMember with id " + id });
			else res.send(data);
		})
		.catch((err) => {
			res.status(500).send({ message: "Error retrieving RoomMember with id=" + id });
		});
};

// Update a RoomMember by the id in the request
exports.update = (req, res) => {
	if (!req.body) {
		return res.status(400).send({
			message: "Data to update can not be empty!",
		});
	}

	const id = req.params.id;

	RoomMember.findByIdAndUpdate(id, req.body, { useFindAndModify: false, new: true })
		.then((data) => {
			if (!data) {
				res.status(404).send({
					message: `Cannot update RoomMember with id=${id}. Maybe RoomMember was not found!`,
				});
			} else res.send({ message: "RoomMember was updated successfully." });
		})
		.catch((err) => {
			res.status(500).send({
				message: "Error updating RoomMember with id=" + id,
			});
		});
};

// Delete a RoomMember with the specified id in the request
exports.delete = (req, res) => {
	const id = req.params.id;

	RoomMember.findByIdAndRemove(id, { useFindAndModify: false })
		.then((data) => {
			if (!data) {
				res.status(404).send({
					message: `Cannot delete RoomMember with id=${id}. Maybe RoomMember was not found!`,
				});
			} else {
				res.send({
					message: "RoomMember was deleted successfully!",
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: "Could not delete RoomMember with id=" + id,
			});
		});
};

// Delete all RoomMembers from the database.
exports.deleteAll = (req, res) => {
	RoomMember.deleteMany({})
		.then((data) => {
			res.send({
				message: `${data.deletedCount} RoomMembers were deleted successfully!`,
			});
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || "Some error occurred while removing all members.",
			});
		});
};

// Find all published RoomMembers
exports.findAllOwners = (req, res) => {
	RoomMember.find({ is_owner: true })
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || "Some error occurred while retrieving members.",
			});
		});
};
