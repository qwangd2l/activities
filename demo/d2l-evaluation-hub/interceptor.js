function startMockServer(mappings) {
	const oldFetch = window.d2lfetch.fetch.bind(window.d2lfetch);
	window.d2lfetch.fetch = function(input, options) {
		return intercept(input, options, mappings).catch(() => {
			return oldFetch(input, options);
		});
	};
}

function intercept(input, options, mappings) {
	if (mappings[input]) {
		return Promise.resolve({
			ok: true,
			json: function() {
				return Promise.resolve(mappings[input]);
			}
		});
	}
	return Promise.reject();
}

export default startMockServer;
