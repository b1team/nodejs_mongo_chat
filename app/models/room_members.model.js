module.exports = (mongoose) => {
	var schema = mongoose.Schema(
		{
			room_id: String,
            member_id: String,
            is_owner: {type: Boolean, default: false},
            join_date: {type: Date, default: Date.now}
		},
		{ timestamps: true }
	);

	schema.method("toJSON", function () {
		const { __v, _id, ...object } = this.toObject();
		object.id = _id;
		return object;
	});

	const room_member = mongoose.model("roommembers", schema);
	return room_member;
};
