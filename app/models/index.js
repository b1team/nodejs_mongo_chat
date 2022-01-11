const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.rooms = require("./rooms.model.js")(mongoose);
db.users = require("./users.model.js")(mongoose);
db.room_members = require("./room_members.model.js")(mongoose);
db.messages = require("./messages.model.js")(mongoose);

module.exports = db;
