/*eslint no-console: "off"*/

function startMockServer(mappings, debug) {
	const oldFetch = window.d2lfetch.fetch.bind(window.d2lfetch);

	if (debug) {
		console.group('All Mappings');
		console.log(mappings);
		console.groupEnd();
	}

	window.d2lfetch.fetch = function(input, options) {
		if (debug) {
			console.groupCollapsed(input);
		}
		return intercept(input, options, mappings, debug).catch(() => {
			if (debug) {
				console.log('No mappings found, falling back to d2lfetch.fetch');
				console.groupEnd();
			}
			return oldFetch(input, options);
		});
	};
}

function intercept(input, options, mappings, debug) {
	if (mappings[input]) {
		if (debug) {
			console.dir(mappings[input]);
			console.log(JSON.stringify(mappings[input], null, 2));
			console.groupEnd();
		}
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
