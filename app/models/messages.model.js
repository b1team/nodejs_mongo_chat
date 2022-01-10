module.exports = (mongoose) => {
	var schema = mongoose.Schema(
		{
			content: String,
			sender_id: String,
			room_id: String,
            seen: {type: Boolean, default: false},
            active: {type: Boolean, default: true}
		},
		{ timestamps: true }
	);

	schema.method("toJSON", function () {
		const { __v, _id, ...object } = this.toObject();
		object.id = _id;
		return object;
	});

	const messages = mongoose.model("messages", schema);
	return messages;
};
