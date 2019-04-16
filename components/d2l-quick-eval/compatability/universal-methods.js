const StringEndsWith = (str, search) => {
	if (typeof str !== 'string' || typeof search !== 'string') {
		return false;
	}
	if (search.length > str.length) {
		return false;
	}

	return str.substring(str.length - search.length, str.length) === search;
};

export { StringEndsWith };
