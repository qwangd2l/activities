(function() {
	var list;

	async function loadPromise(url) {
		var entity = await window.D2L.Siren.EntityStore.fetch(url, '');
		await list._loadData(entity.entity);
	}

	var expectedData = [
		{
			displayName: 'User Name',
			courseName: 'Org Name',
			activityName: 'Assignment Name',
			submissionDate: '2018-02-03T17:00:00.000Z',
			activityLink: 'https://www.example.com/'
		},
		{
			displayName: 'User Name',
			courseName: 'Org Name',
			activityName: 'Quiz Name',
			submissionDate: '2018-02-03T17:00:00.000Z',
			activityLink: 'https://www.example.com/'
		},
		{
			displayName: 'User Name',
			courseName: 'Org Name',
			activityName: 'Topic Name',
			submissionDate: '2018-02-03T17:00:00.000Z',
			activityLink: 'https://www.example.com/'
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
		test('headers display correctly', function() {
			flush(function() {
				var headers = list.shadowRoot.querySelectorAll('d2l-th');
				for (var i = 0; i < expectedHeaders.length; i++) {
					assert.equal(expectedHeaders[i], headers[i].innerHTML);
				}
			});
		});
		test('data is imported correctly', async() => {
			await loadPromise('data/unassessedActivities.json');

			assert.equal(list._data.length, expectedData.length);
			assert.deepEqual(list._data, expectedData);
		});
		test('data displays correctly', async() => {
			var expected = [];

			expectedData.forEach(function(item) {
				expected.push({ text: item.displayName, link: item.activityLink });
				expected.push({ text: item.activityName, link: '' });
				expected.push({ text: item.courseName, link: '' });
				expected.push({ text: item.submissionDate, link: '' });
			});

			await loadPromise('data/unassessedActivities.json');

			var data = list.shadowRoot.querySelectorAll('d2l-td');
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
		});
		test('_initialLoading and _loading are set to true before data is loaded, and loading-spinner is present', async() => {
			var loadingSpinner = list.shadowRoot.querySelector('d2l-loading-spinner');
			assert.equal(loadingSpinner.hidden, false);
			assert.equal(list._initialLoading, true);
			assert.equal(list._loading, true);
		});
		test('_initialLoading and _loading is set to false after data is loaded and the loading spinner is hidden', async() => {
			var loadingSpinner = list.shadowRoot.querySelector('d2l-loading-spinner');

			await loadPromise('data/unassessedActivities.json');

			assert.equal(loadingSpinner.hidden, true);
			assert.equal(list._initialLoading, false);
			assert.equal(list._loading, false);
		});
	});
})();
