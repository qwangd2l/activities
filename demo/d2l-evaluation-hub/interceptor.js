/*eslint no-console: "off"*/

function parsePathNoLeadingSlash(input) {
	const parsed = new window.URL(input, 'https://doesntmatter.org/');
	const path = parsed.pathname.substring(1);

	return path;
}

function startMockServer(mappings, debug) {
	const oldFetch = window.d2lfetch.fetch.bind(window.d2lfetch);

	if (debug) {
		console.group('All Mappings');
		console.log(mappings);
		console.groupEnd();
	}

	window.d2lfetch.fetch = function(input, options) {
		const path = parsePathNoLeadingSlash(input);
		if (debug) {
			console.groupCollapsed(path);
		}
		return intercept(path, options, mappings, debug).catch(() => {
			if (debug) {
				console.log('No mappings found, falling back to d2lfetch.fetch');
				console.groupEnd();
			}
			return oldFetch(input, options);
		});
	};
}

function intercept(path, options, mappings, debug) {
	if (mappings[path]) {
		if (debug) {
			console.dir(mappings[path]);
			console.log(JSON.stringify(mappings[path], null, 2));
			console.groupEnd();
		}
		return Promise.resolve({
			ok: true,
			json: function() {
				return Promise.resolve(mappings[path]);
			}
		});
	}
	return Promise.reject();
}

export default startMockServer;
