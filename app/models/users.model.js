module.exports = (mongoose) => {
	var schema = mongoose.Schema(
		{
			username: String,
			password: String,
            name: String,
            avatar: {type: String, default: "https://image.flaticon.com/icons/png/128/860/860784.png"},
			active: {type: Boolean, default: true}
		},
		{ timestamps: true }
	);

	schema.method("toJSON", function () {
		const { __v, _id, ...object } = this.toObject();
		object.id = _id;
		return object;
	});

	const users = mongoose.model("users", schema);
	return users;
};
