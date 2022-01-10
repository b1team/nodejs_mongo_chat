const db = require("../models");
const User = db.users;

// Create and Save a new user
exports.create = (req, res) => {
	// Validate request
	if (!req.body.username) {
		res.status(400).send({ message: "Username can not be empty!" });
		return;
	}
    if (!req.body.password) {
		res.status(400).send({ message: "Password can not be empty!" });
		return;
	}
    if (!req.body.name) {
		res.status(400).send({ message: "Name can not be empty!" });
		return;
	}

	// Create a user
	const user = new User({
		username: req.body.username,
		password: req.body.password,
		name: req.body.name,
	});

	// Save user in the database
	user
		.save(user)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || "Some error occurred while creating the user.",
			});
		});
};

// Retrieve all users from the database.
exports.findAll = (req, res) => {
	const username = req.query.username;
	var condition = username ? { username: { $regex: new RegExp(username), $options: "i" } } : {};

	User.find(condition)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || "Some error occurred while retrieving users.",
			});
		});
};

// Find a single user with an id
exports.findOne = (req, res) => {
	const id = req.params.id;

	User.findById(id)
		.then((data) => {
			if (!data) res.status(404).send({ message: "Not found user with id " + id });
			else res.send(data);
		})
		.catch((err) => {
			res.status(500).send({ message: "Error retrieving user with id=" + id });
		});
};

// Update a user by the id in the request
exports.update = (req, res) => {
	if (!req.body) {
		return res.status(400).send({
			message: "Data to update can not be empty!",
		});
	}

	const id = req.params.id;

	User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
		.then((data) => {
			if (!data) {
				res.status(404).send({
					message: `Cannot update user with id=${id}. Maybe user was not found!`,
				});
			} else res.send({ message: "user was updated successfully." });
		})
		.catch((err) => {
			res.status(500).send({
				message: "Error updating user with id=" + id,
			});
		});
};

// Delete a user with the specified id in the request
exports.delete = (req, res) => {
	const id = req.params.id;

	User.findByIdAndRemove(id, { useFindAndModify: false })
		.then((data) => {
			if (!data) {
				res.status(404).send({
					message: `Cannot delete user with id=${id}. Maybe user was not found!`,
				});
			} else {
				res.send({
					message: "user was deleted successfully!",
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: "Could not delete user with id=" + id,
			});
		});
};

// Delete all users from the database.
exports.deleteAll = (req, res) => {
	User.deleteMany({})
		.then((data) => {
			res.send({
				message: `${data.deletedCount} users were deleted successfully!`,
			});
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || "Some error occurred while removing all users.",
			});
		});
};

// Find all published users
exports.findAllActive = (req, res) => {
	User.find({ active: true })
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || "Some error occurred while retrieving users.",
			});
		});
};
