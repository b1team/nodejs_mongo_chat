module.exports = (mongoose) => {
	var schema = mongoose.Schema(
		{
			type: { type: String, default: 'private'},
			room_name: { type: String, required: true},
            display_name: { type: String, default: ''},
            avatar: { type: String, default: ''}
		},
		{ timestamps: true }
	);

	schema.method("toJSON", function () {
		const { __v, _id, ...object } = this.toObject();
		object.id = _id;
		return object;
	});

	const room = mongoose.model("rooms", schema);
	return room;
};
