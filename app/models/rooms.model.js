module.exports = (mongoose) => {
	var schema = mongoose.Schema(
		{
			type: { type: String, default: "private" },
			room_name: { type: String, required: true },
			display_name: { type: String, default: "" },
			avatar: { type: String, default: "" },
		},
		{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
	);

	schema.method("toJSON", function () {
		const { __v, _id, createdAt, updatedAt, ...object } = this.toObject();
		object.id = _id;
		// object.created_at = createdAt;
		// object.updated_at = updatedAt;
		return object;
	});

	const room = mongoose.model("rooms", schema);
	return room;
};
