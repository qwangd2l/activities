import '@polymer/iron-test-helpers/mock-interactions.js';

(function() {
	var list;

	async function loadPromise(url) {
		var entity = await window.D2L.Siren.EntityStore.fetch(url, '');
		await list._loadData(entity.entity);
	}

	function createExpectedData(expectedArray) {
		var expected = [];

		expectedArray.forEach(function(item) {
			expected.push({ text: item.displayName, link: item.activityLink });
			expected.push({ text: item.activityName, link: '' });
			expected.push({ text: item.courseName, link: '' });
			expected.push({ text: item.submissionDate, link: '' });
		});

		return expected;
	}

	function verifyData(expected, done) {
		var data = list.shadowRoot.querySelectorAll('d2l-td');
		if (data.length !== expected.length) {
			window.setTimeout(function() {
				verifyData(expected, done);
			}, 30);
		} else {
			for (var i = 0; i < expected.length; i++) {
				var link = data[i].querySelector('d2l-link');
				var span = data[i].querySelector('span');
				var linkHidden = link.hasAttribute('hidden');
				var spanHidden = span.hasAttribute('hidden');

				assert.equal(expected[i].text, link.innerHTML);
				assert.equal(expected[i].text, span.innerHTML);
				assert.equal(!(expected[i].link), linkHidden);
				assert.equal(!!(expected[i].link), spanHidden);
			}
			done();
		}
	}

	var expectedData = [
		{
			displayName: 'User Name',
			courseName: 'Org Name',
			activityName: 'Assignment Name',
			submissionDate: '2018-02-03T17:00:00.000Z',
			activityLink: '/the/best/vanity/url/3'
		},
		{
			displayName: 'User Name',
			courseName: 'Org Name',
			activityName: 'Quiz Name',
			submissionDate: '2019-02-22T02:00:00.000Z',
			activityLink: '/the/best/vanity/url/2'
		},
		{
			displayName: 'User Name',
			courseName: 'Org Name',
			activityName: 'Topic Name',
			submissionDate: '2019-02-20T02:00:00.000Z',
			activityLink: '/the/best/vanity/url'
		}
	];

	var expectedNextData = [
		{
			displayName: 'User Name',
			courseName: 'Org Name',
			activityName: 'Another Assignment Name',
			submissionDate: '2018-02-03T17:00:00.000Z',
			activityLink: '/the/best/vanity/url/next1'
		},
		{
			displayName: 'User Name',
			courseName: 'Org Name',
			activityName: 'Another Quiz Name',
			submissionDate: '2018-02-03T17:00:00.000Z',
			activityLink: '/the/best/vanity/url/next2'
		},
		{
			displayName: 'User Name',
			courseName: 'Org Name',
			activityName: 'Another Topic Name',
			submissionDate: '2019-02-20T02:00:00.000Z',
			activityLink: '/the/best/vanity/url/next3'
		}
	];
	var expectedHeaders = [
		'First Name, Last Name', 'Activity Name', 'Course', 'Submission Date'
	];

	suite('d2l-evaluation-hub-activities-list', function() {
		setup(function() {
			list = fixture('basic');
		});
		test('instantiating the element works', function() {
			assert.equal(list.tagName.toLowerCase(), 'd2l-evaluation-hub-activities-list');
		});
		test('attributes are set correctly', function() {
			assert.equal(list.href, 'blah');
			assert.equal(list.token, 't');
		});
		test('_initialLoading and _loading are set to true before data is loaded, and loading-spinner is present', () => {
			var loadingSpinner = list.shadowRoot.querySelector('d2l-loading-spinner');
			assert.equal(loadingSpinner.hidden, false);
			assert.equal(list._initialLoading, true);
			assert.equal(list._loading, true);
		});
		test('_initialLoading and _loading is set to false after data is loaded and the loading spinner is hidden', (done) => {
			var loadingSpinner = list.shadowRoot.querySelector('d2l-loading-spinner');

			loadPromise('data/unassessedActivities.json').then(function() {
				assert.equal(loadingSpinner.hidden, true);
				assert.equal(list._initialLoading, false);
				assert.equal(list._loading, false);
				done();
			});
		});
		test('headers display correctly', function() {
			flush(function() {
				var headers = list.shadowRoot.querySelectorAll('d2l-th d2l-table-col-sort-button');
				for (var i = 0; i < expectedHeaders.length; i++) {
					assert.include(headers[i].innerHTML, expectedHeaders[i]);
				}
			});
		});
		test('data is imported correctly', (done) => {
			loadPromise('data/unassessedActivities.json').then(function() {
				assert.equal(list._data.length, expectedData.length);
				assert.deepEqual(list._data, expectedData);
				done();
			});
		});
		test('data displays correctly', (done) => {
			var expected = createExpectedData(expectedData);

			loadPromise('data/unassessedActivities.json').then(function() {
				verifyData(expected, done);
			});
		});
		test('the Load More button appears when there is a next link', (done) => {
			loadPromise('data/unassessedActivities.json').then(function() {
				var loadMore = list.shadowRoot.querySelector('.d2l-evaluation-hub-activities-list-load-more');
				assert.equal(loadMore.tagName.toLowerCase(), 'd2l-button');
				assert.notEqual(loadMore.style.display, 'none');
				assert.notEqual(loadMore.disabled, 'true');
				done();
			});
		});
		test('clicking Load More adds the proper data, and the button is hidden when there is no more next link', (done) => {
			var expectedNext = createExpectedData(expectedData.concat(expectedNextData));

			loadPromise('data/unassessedActivities.json').then(function() {
				var loadMore = list.shadowRoot.querySelector('.d2l-evaluation-hub-activities-list-load-more');
				var loadMoreContainer = list.shadowRoot.querySelector('.d2l-evaluation-hub-activities-list-load-more-container');
				var verify = function() {
					if (loadMoreContainer.style.display === 'none') {
						verifyData(expectedNext, done);
					} else {
						window.setTimeout(function() {
							verify();
						}, 30);
					}
				};
				loadMore.addEventListener('click', verify);
				MockInteractions.tap(loadMore);
			});
		});
	});
})();
