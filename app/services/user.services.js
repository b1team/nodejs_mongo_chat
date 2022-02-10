const db = require("../models");
const User = db.users;

module.exports.getUser = function (username, callback) {
    User.findOne({ 'username': username }).then((data) => {
        if (data == null) {
            callback(null, null)
            return;
        }
        callback(null, data.toJSON());
    }).catch((err) => callback(null, err));
};


module.exports.getUserById = function (id, callback) {
    User.findById(id).then((data) => {
        if (data == null) {
            callback(null, null);
            return;
        }
        callback(null, data.toJSON());
    }).catch((err) => callback(null, err));
}

module.exports.getUserInfo = function (id, callback) {
    User.findById(id).then((user) => {
        if (!user) {
            callback(null, null);
            return;
        }
        const filter = {
            username: user.username,
            name: user.name,
            user_id: user._id,
            avatar: user.avatar,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };
        callback(null, filter);
    }).catch((err) => callback(null, err));
}


module.exports.getUserInfoByUsername = function (username, callback) {
    User.findOne({ 'username': username }).then((user) => {
        if (!user) {
            callback(null, null);
            return;
        }
        const filter = {
            username: user.username,
            name: user.name,
            user_id: user._id,
            avatar: user.avatar,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };
        callback(null, filter);
    }).catch((err) => callback(err, null));
}


module.exports.getUserPassword = (username) => {
    return new Promise((resolve, reject) => {
        User.findOne({ 'username': username }).then((data) => {
            if (data == null) {
                resolve(null);
                return;
            }
            resolve({ password: data.password, id: data._id });
        }).catch((err) => reject(err));
    });
}
