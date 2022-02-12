const db = require("../models");
const User = db.users;

const strip = require("../utils/trim.utils");
const encryption = require("../utils/encryption");
const userService = require("../services/user.services");

// Create and Save a new user
exports.create = (req, res) => {
	// Validate request
	if (
		strip.strip(req.body.username).length == 0 ||
		strip.strip(req.body.password).length == 0 ||
		strip.strip(req.body.name).length == 0
	) {
		res.status(400).send({ message: "Invalid username or password or name" });
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
	encryption.encrypt(req.body.password).then(encryptedPassword => {
		;
		const user = new User({
			username: req.body.username,
			password: encryptedPassword,
			name: req.body.name,
		});

		user.save(user)
			.then((data) => {
				res.send(data);
			})
			.catch((err) => {
				console.error("Save user error. User=" + user + " error" + err);
				res.status(500).send({
					message: "Some error occurred while creating the user.",
				});
			});
	}).catch(err => {
		console.error("Encryption error" + err);
		res.status(500).send({ "message": "Some error occurred while encrypting password" });
	});
};


// Tim theo username
exports.findOne = (req, res) => {
	const username = req.params.username;
	if (req.user.username !== username) {
		res.status(403).send({ message: "You are not allowed to access this resource" });
		return;
	}

	userService.getUserInfoByUsername(username, (err, data) => {
		if (err) {
			console.error("Get user info error. User=" + username + " error" + err);
			res.status(500).send({
				message: "Some error occurred while retrieving user info.",
			});
		} else {
			if (!data) {
				res.status(404).send({ message: "Not found user with username " + username });
			} else {
				res.send(data);
			}
		}
	});
};

// Update a user by the id in the request
exports.update = (req, res) => {
	if (!req.body) {
		return res.status(400).send({
			message: "Data to update can not be empty!",
		});
	}

	const id = req.user.user_id;
	if (strip.strip(req.body.username).length == 0) {
		res.status(400).send({ message: "Username can not be empty!" });
		return;
	}

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


exports.findMe = (req, res) => {
	if (!req.user) {
		res.status(401).send({ "message": "Invalid authentication" });
	} else {
		res.send(req.user);
	}
};

