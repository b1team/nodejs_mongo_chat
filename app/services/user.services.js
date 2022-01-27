const db = require("../models");
const User = db.users;

module.exports.getUser = function (username, callback) {
	User.findOne({ 'username': username }).then((data) => {
        if (data == null){
            callback(null, null)
            return;
        }
        callback(null, data.toJSON());
    }).catch((err) => callback(null, err));
};


module.exports.getUserById = function(id, callback) {
    User.findById(id).then((data) => {
        if (data == null){
            callback(null, null);
            return;
        }
        callback(null, data.toJSON());
    }).catch((err) => callback(null, err));
}

module.exports.getUserInfo = function(id, callback) {
    User.findById(id).then((user) => {
        const filter = {
			username: user.username,
			name: user.name,
			user_id: user._id,
			avatar: user.avatar,
		};
        callback(null, filter);
    }).catch((err) => callback(null, err));
}