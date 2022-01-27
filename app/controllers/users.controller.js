const db = require("../models");
const User = db.users;

const strip = require("../utils/trim.utils");

// Create and Save a new user
exports.create = (req, res) => {
	// Validate request
	if (
		strip.strip(req.body.username).length == 0 ||
		strip.strip(req.body.password).length == 0 ||
		strip.strip(req.body.name).length == 0
	) {
		res.status(404).send({ message: "Invalid username or password or name" });
	}
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

	user.save(user)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || "Some error occurred while creating the user.",
			});
		});
};


// Tim theo username
exports.findOne = (req, res) => {
	const username = req.params.username;

	User.findOne({ username: username })
		.then((data) => {
			if (!data)
				res.status(404).send({ message: "Not found user with username " + username });
			else res.send(data);
		})
		.catch((err) => {
			res.status(500).send({ message: "Error retrieving user with username=" + username });
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

	User.findByIdAndUpdate(id, req.body, { useFindAndModify: false, new: true })
		.then((data) => {
			if (!data) {
				res.status(404).send({
					message: `Cannot update user with id=${id}. Maybe user was not found!`,
				});
			} else res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: "Error updating user with id=" + id,
			});
		});
};