const WebSocket = require("ws");
const auth = require("./app/controllers/auth.controller")
const chatWebsocketServer = new WebSocket.Server({ noServer: true, verifyClient: auth.verifyWebsocketToken });
const notifyWebsocketServer = new WebSocket.Server({ noServer: true, verifyClient: auth.verifyWebsocketToken });

require("dotenv").config();

const redis = require("redis");
const res = require("express/lib/response");

function isJsonString(str) {
    try {
        var json = JSON.parse(str);
        return (typeof json === 'object');
    } catch (e) {
        return false;
    }
}


chatWebsocketServer.on('connection', function connection(ws, request) {
    if (!request.user) {
        ws.close(code = 1008, data = JSON.stringify({ "message": "Unauthorized" }));
        return
    }

    const subscriber = redis.createClient({ url: process.env.REDIS_URL })
    subscriber.duplicate()
    subscriber.connect().catch(err => {
        console.error("CONNECT TO CHAT REDIS ERROR: " + err)
    })

    const user_id = request.user.user_id
    console.info("USER:  " + user_id + " CONNECTED")
    subscriber.subscribe(user_id.toString(), (message) => {
        if (!isJsonString(message)) {
            console.warn("MESSAGE " + message + " IS INVALID")
            return
        }
        ws.send(message)
        console.info("MESSAGE " + message + " WAS SENT TO USER " + user_id)
    });
});

notifyWebsocketServer.on('connection', function connection(ws, request) {
    if (!request.user) {
        ws.close(code = 1008, data = JSON.stringify({ "message": "Unauthorized" }));
        return
    }

    const subscriber = redis.createClient({ url: process.env.REDIS_URL })
    subscriber.duplicate()
    subscriber.connect().catch(err => {
        console.error("CONNECT TO NOTIFY REDIS ERROR: " + err)
    })
    const user_id = request.user.user_id
    console.info("USER:  " + user_id + " IS CONNECTED TO NOTIFICATIONS")
    subscriber.subscribe(user_id.toString() + "_notify", (message) => {
        if (!isJsonString(message)) {
            console.warn("MESSAGE " + message + " IS INVALID")
            return
        }
        ws.send(message)
        console.info("NOTIFY MESSAGE " + message + " WAS SENT TO USER " + user_id)
    });
});


module.exports = { chatWS: chatWebsocketServer, notifyWS: notifyWebsocketServer }