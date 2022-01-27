module.exports.date_format = function (datetime) {
	const d = new Date(datetime);
	const year = d.getFullYear();
	const date = d.getDate();
	const hour = d.getHours();
	const minute = d.getMinutes();

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const monthIndex = d.getMonth();
	const monthName = months[monthIndex];

	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const dayName = days[d.getDay()];

	const formatted = `${date} ${monthName}, ${year} ${hour}:${minute}`;

	return formatted;
};
