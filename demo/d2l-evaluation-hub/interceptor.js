function intercept(input, options, mappings) {
	if (mappings[input]) {
		return Promise.resolve({
			ok: true,
			json: function() {
				return Promise.resolve(mappings[input])
			}
		});
	}
	return Promise.reject();
}

export default intercept;
