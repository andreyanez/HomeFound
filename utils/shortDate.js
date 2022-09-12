export default dateString => {
	const date = new Date(dateString);
	return date.toLocaleDateString();
};
