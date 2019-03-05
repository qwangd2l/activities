import '@polymer/iron-test-helpers/mock-interactions.js';

(function() {
	var list;

	async function loadPromise(url) {
		var entity = await window.D2L.Siren.EntityStore.fetch(url, '');
		await list._loadData(entity.entity);
	}

	function createExpectedData(expectedArray, includeMasterTeacher) {
		var expected = [];

		expectedArray.forEach(function(item) {
			expected.push({ text: item.displayName, href: item.activityLink });
			expected.push({ href: item.activityName });
			expected.push({ text: item.courseName });
			expected.push({ text: item.submissionDate });

			if (includeMasterTeacher) {
				expected.push({ text: item.masterTeacher });
			}
		});

		return expected;
	}

	function createExpectedDataWithMasterTeacher(expectedArray) {
		return createExpectedData(expectedArray, true);
	}

	function verifyData(expected, done) {
		const data = list.shadowRoot.querySelectorAll('d2l-td');

		console.dir(expected);

		for (let i = 0; i < expected.length; i++) {
			const link = data[i].querySelector('d2l-link');
			const span = data[i].querySelector('span');
			const activityName = data[i].querySelector('d2l-activity-name');

			if (link) {
				assert.equal(expected[i].text, link.innerHTML);
				assert.equal(expected[i].href, link.href);
			} else if (span) {
				assert.equal(expected[i].text, span.innerHTML);
			} else if (activityName) {
				console.dir('activityName: ' + i);
				console.dir(activityName);
				console.dir('expected: ' + expected[i].href);
				console.dir('actual: ' + activityName.href);
				assert.equal(expected[i].href, activityName.href);
			}
		}
		done();
	}

	var expectedData = [
		{
			displayName: 'User Name',
			courseName: 'Org Name',
			activityName: 'data/assignmentActivity.json',
			submissionDate: '2018-02-03T17:00:00.000Z',
			activityLink: '/the/best/vanity/url/3',
			masterTeacher: ''
		},
		{
			displayName: 'User Name',
			courseName: 'Org Name',
			activityName: 'data/quizAttemptActivity.json',
			submissionDate: '2019-02-22T02:00:00.000Z',
			activityLink: '/the/best/vanity/url/2',
			masterTeacher: ''
		},
		{
			displayName: 'User Name',
			courseName: 'Org Name',
			activityName: 'data/topicActivity.json',
			submissionDate: '2019-02-20T02:00:00.000Z',
			activityLink: '/the/best/vanity/url',
			masterTeacher: ''
		}
	];

	var expectedDataWithMasterTeacher = expectedData.map(function(x) {
		var updatedExpectedData = {};

		Object.keys(x).forEach(function(key) {
			updatedExpectedData[ key ] = x[ key ];
		});

		updatedExpectedData.masterTeacher = 'Master Teacher';
		return updatedExpectedData;
	});

	var expectedNextData = [
		{
			displayName: 'User Name',
			courseName: 'Org Name',
			activityName: 'data/nextAssignmentActivity.json',
			submissionDate: '2018-02-03T17:00:00.000Z',
			activityLink: '/the/best/vanity/url/next1',
			masterTeacher: 'Master Teacher'
		},
		{
			displayName: 'User Name',
			courseName: 'Org Name',
			activityName: 'data/nextQuizAttemptActivity.json',
			submissionDate: '2018-02-03T17:00:00.000Z',
			activityLink: '/the/best/vanity/url/next2',
			masterTeacher: 'Master Teacher'
		},
		{
			displayName: 'User Name',
			courseName: 'Org Name',
			activityName: 'data/nextTopicActivity.json',
			submissionDate: '2019-02-20T02:00:00.000Z',
			activityLink: '/the/best/vanity/url/next3',
			masterTeacher: 'Master Teacher'
		}
	];
	var expectedHeaders = [
		'First Name, Last Name', 'Activity Name', 'Course', 'Submission Date'
	];
	var expectedHeadersWithMasterTeacher = expectedHeaders.concat('Master Teacher');

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
		test('_fullListLoading and _loading are set to true before data is loaded, and loading-spinner is present', () => {
			var loadingSpinner = list.shadowRoot.querySelector('d2l-loading-spinner');
			assert.equal(loadingSpinner.hidden, false);
			assert.equal(list._fullListLoading, true);
			assert.equal(list._loading, true);
		});
		test('_fullListLoading and _loading is set to false after data is loaded and the loading spinner is hidden', (done) => {
			var loadingSpinner = list.shadowRoot.querySelector('d2l-loading-spinner');

			loadPromise('data/unassessedActivities.json').then(function() {
				assert.equal(loadingSpinner.hidden, true);
				assert.equal(list._fullListLoading, false);
				assert.equal(list._loading, false);
				done();
			});
		});
		test('headers display correctly', function(done) {
			flush(function() {
				var headers = list.shadowRoot.querySelectorAll('d2l-th d2l-table-col-sort-button');

				assert.equal(expectedHeaders.length, headers.length);

				for (var i = 0; i < expectedHeaders.length; i++) {
					assert.include(headers[i].innerHTML, expectedHeaders[i]);
				}
				done();
			});
		});
		test('headers include master teacher when toggled on, and is display correctly', function(done) {
			list.setAttribute('master-teacher', '');

			flush(function() {

				var headers = list.shadowRoot.querySelectorAll('d2l-th d2l-table-col-sort-button');
				assert.equal(expectedHeadersWithMasterTeacher.length, headers.length);

				for (var i = 0; i < expectedHeadersWithMasterTeacher.length; i++) {
					assert.include(headers[i].innerHTML, expectedHeadersWithMasterTeacher[i]);
				}
				done();
			});
		});
		test('data is imported correctly', (done) => {
			loadPromise('data/unassessedActivities.json').then(function() {
				assert.equal(list._data.length, expectedData.length);
				assert.deepEqual(list._data, expectedData);
				done();
			});
		});
		test('data is imported correctly when master teacher toggled on', (done) => {
			list.setAttribute('master-teacher', '');

			flush(function() {
				loadPromise('data/unassessedActivities.json').then(function() {
					assert.equal(list._data.length, expectedDataWithMasterTeacher.length);
					assert.deepEqual(list._data, expectedDataWithMasterTeacher);
					done();
				});
			});
		});
		test('data displays correctly', (done) => {
			var expected = createExpectedData(expectedData);

			loadPromise('data/unassessedActivities.json').then(function() {
				verifyData(expected, done);
			});
		});
		test('data displays correctly when master teacher toggled on', (done) => {
			var expected = createExpectedDataWithMasterTeacher(expectedDataWithMasterTeacher);

			list.setAttribute('master-teacher', '');
			flush(function() {
				loadPromise('data/unassessedActivities.json').then(function() {
					verifyData(expected, done);
				});
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

			// fix dis

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
