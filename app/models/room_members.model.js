module.exports = (mongoose) => {
	var schema = mongoose.Schema(
		{
			room_id: String,
			member_id: String,
			is_owner: { type: Boolean, default: false },
			join_date: { type: Date, default: Date.now },
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

	const room_member = mongoose.model("roommembers", schema);
	return room_member;
};
