module.exports = (mongoose) => {
	var schema = mongoose.Schema(
		{
			content: String,
			sender_id: String,
			room_id: String,
			seen: { type: Boolean, default: false },
			active: { type: Boolean, default: true },
		},
		{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
	);

	schema.method("toJSON", function () {
		const { __v, _id, createdAt, updatedAt, ...object } = this.toObject();
		object.message_id = _id;
		// object.created_at = createdAt;
		// object.updated_at = updatedAt;
		return object;
	});

	const messages = mongoose.model("messages", schema);
	return messages;
};
