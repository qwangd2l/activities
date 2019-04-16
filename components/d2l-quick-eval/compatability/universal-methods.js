/*
All functions in this file should work across all browsers.
Initially intended for enabling compatability with IE11, but applies to any browser missing some functionality.
*/

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
