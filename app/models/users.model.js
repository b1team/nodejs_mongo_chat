module.exports = (mongoose) => {
	var schema = mongoose.Schema(
		{
			username:{type: String, unique: true, required: true},
			password: { type: String, required: true},
			name: String,
			avatar: {
				type: String,
				default: "https://image.flaticon.com/icons/png/128/860/860784.png",
			},
			active: { type: Boolean, default: true },
		},
		{ timestamps: { createdAt: "created_at", updatedAt: "updated_at"} }
	);

	schema.method("toJSON", function () {
		const { __v, _id, createdAt, updatedAt, ...object } = this.toObject();
		object.user_id = _id;
		// object.created_at = createdAt;
		// object.updated_at = updatedAt;
		return object;
	});

	const users = mongoose.model("users", schema);
	return users;
};
