(function() {
	var list;

	function loadPromise(url) {
		return window.D2L.Siren.EntityStore.fetch(url, '')
			.then(function(entity) {
				return list.loadData(entity);
			});
	}

	var expectedData = [
		{
			displayName: 'User Name',
			courseName: 'Org Name',
			activityName: 'Assignment Name',
			submissionDate: '2018-02-03T17:00:00.000Z',
			activityLink: 'link to activity'
		}
	];
	var expectedHeaders = [
		'Submitter', 'Activity Name', 'Course Name', 'Submission Date'
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
		test('data is imported from root correctly', async() => {
			await loadPromise('data/root.json');

			assert.equal(list._data.length, expectedData.length);
			assert.deepEqual(list._data, expectedData);
		});
		test('data is imported from activities correctly', async() => {
			await loadPromise('data/unassessedActivities.json');

			assert.equal(list._data.length, expectedData.length);
			assert.deepEqual(list._data, expectedData);
		});
		test('data displays correctly', async() => {
			var expected = [];

			expectedData.forEach(function(item) {
				expected.push(item.displayName);
				expected.push(item.activityName);
				expected.push(item.courseName);
				expected.push(item.submissionDate);
			});

			await loadPromise('data/root.json');

			var data = list.shadowRoot.querySelectorAll('d2l-td');
			for (var i = 0; i < expected.length; i++) {
				assert.equal(expected[i], data[i].innerHTML);
			}
		});
	});
})();
