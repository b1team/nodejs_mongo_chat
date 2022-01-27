const redis = require("redis");

module.exports.publish = function (channel, event) {
	const publisher = redis.createClient({
		url: process.env.REDIS_URL
	});

	publisher.publish(channel, JSON.parse(JSON.stringify(event)));
};

module.exports.subscribe = function (channel) {
	const subscriber = redis.createClient({
		url: process.env.REDIS_URL,
	});

	subscriber.subscribe(channel, (message) => {
		console.log(message); // 'message'
	});

};
