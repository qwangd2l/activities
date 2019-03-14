import '@polymer/iron-test-helpers/mock-interactions.js';

(function() {
	var list;

	async function loadPromise(url) {
		var entity = await window.D2L.Siren.EntityStore.fetch(url, '');
		await list._loadData(entity.entity);
	}

	function createExpectedData(expectedData, includeMasterTeacher) {
		var expectedActivities = [];

		expectedData.forEach(function(item) {
			var expectedActivity = {
				isDraft: item.isDraft
			};

			var activityColumns = [];

			activityColumns.push({ text: item.displayName, href: item.activityLink });
			activityColumns.push({ href: item.activityNameHref });
			activityColumns.push({ text: item.courseName });
			activityColumns.push({ text: item.submissionDate });

			if (includeMasterTeacher) {
				activityColumns.push({ text: item.masterTeacher });
			}

			expectedActivity.data = activityColumns;

			expectedActivities.push(expectedActivity);
		});

		return expectedActivities;
	}

	function createExpectedDataWithMasterTeacher(expectedArray) {
		return createExpectedData(expectedArray, true);
	}

	function verifyData(expectedActivities, done) {
		var data = list.shadowRoot.querySelectorAll('d2l-td');

		var expectedActivityData = [].concat.apply(
			[], expectedActivities.map(function(expectedActivity) {
				return expectedActivity.data;
			}));

		for (var i = 0; i < expectedActivityData.length; i++) {
			const link = data[i].querySelector('d2l-link');
			const span = data[i].querySelector('span');
			const activityName = data[i].querySelector('d2l-activity-name');

			if (link) {
				assert.equal(expectedActivityData[i].text, link.innerHTML);
				assert.equal(expectedActivityData[i].href, link.href);
			} else if (span) {
				assert.equal(expectedActivityData[i].text, span.innerHTML);
			} else if (activityName) {
				assert.equal(expectedActivityData[i].href, activityName.href);
			}
		}

		done();
	}

	var expectedData = [
		{
			displayName: 'Special User Name',
			userHref: 'data/userUnique.json',
			courseName: 'Org Name',
			activityNameHref: 'data/assignmentActivity.json',
			submissionDate: '3/9/2019 10:16 AM',
			activityLink: '/the/best/vanity/url/3?filter=96W3siU29ydCI6eyJJ&sort=Y3Rpb24iOjB9',
			masterTeacher: '',
			isDraft: true
		},
		{
			displayName: 'User Name',
			userHref: 'data/user.json',
			courseName: 'Org Name',
			activityNameHref: 'data/quizAttemptActivity.json',
			submissionDate: '3/9/2019 10:16 AM',
			activityLink: '/the/best/vanity/url/2?filter=96W3siU29ydCI6eyJJ&sort=Y3Rpb24iOjB9',
			masterTeacher: '',
			isDraft: false
		},
		{
			displayName: 'User Name',
			userHref: 'data/user.json',
			courseName: 'Org Name',
			activityNameHref: 'data/topicActivity.json',
			submissionDate: '3/9/2019 10:16 AM',
			activityLink: '/the/best/vanity/url?ou=11111&filter=96W3siU29ydCI6eyJJ&sort=Y3Rpb24iOjB9',
			masterTeacher: '',
			isDraft: false
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
			userHref: 'data/user.json',
			courseName: 'Org Name',
			activityNameHref: 'data/nextAssignmentActivity.json',
			submissionDate: '3/9/2019 10:16 AM',
			activityLink: '/the/best/vanity/url/next1?ou=11111&sort=Y3Rpb24iOjB9',
			masterTeacher: 'Master Teacher',
			isDraft: true
		},
		{
			displayName: 'User Name',
			userHref: 'data/user.json',
			courseName: 'Org Name',
			activityNameHref: 'data/nextQuizAttemptActivity.json',
			submissionDate: '3/9/2019 10:16 AM',
			activityLink: '/the/best/vanity/url/next2?sort=Y3Rpb24iOjB9',
			masterTeacher: 'Master Teacher',
			isDraft: false
		},
		{
			displayName: 'User Name',
			userHref: 'data/user.json',
			courseName: 'Org Name',
			activityNameHref: 'data/nextTopicActivity.json',
			submissionDate: '3/9/2019 10:16 AM',
			activityLink: '/the/best/vanity/url/next3?sort=Y3Rpb24iOjB9',
			masterTeacher: 'Master Teacher',
			isDraft: false
		}
	];
	var expectedColumnHeaders = [
		['First Name', 'Last Name'],
		['Activity Name'],
		['Course'],
		['Submission Date']
	];
	var expectedColumnHeadersWithMasterTeacher = expectedColumnHeaders.concat([['Master Teacher']]);

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
		test('no alert displayed when healthy', function() {
			var alert = list.shadowRoot.querySelector('#list-alert');
			assert.equal(true, alert.hasAttribute('hidden'));
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
		test('if _loading is true, the Load More button is hidden', (done) => {
			loadPromise('data/unassessedActivities.json').then(function() {
				var loadMore = list.shadowRoot.querySelector('.d2l-evaluation-hub-activities-list-load-more-container');
				assert.notEqual(loadMore.style.display, 'none');
				list._loading = true;
				requestAnimationFrame(function() {
					assert.equal(loadMore.style.display, 'none');
					done();
				});
			});
		});
		test('if _loading is true, d2l-evaluation-hub-no-submissions-image and d2l-evaluation-hub-no-submissions-image are not shown', () => {
			var noSubmissionComponent = list.shadowRoot.querySelector('.d2l-quick-eval-no-submissions');
			var noCriteriaResultsComponent = list.shadowRoot.querySelector('.d2l-evaluation-hub-no-criteria-results');
			assert.equal(noSubmissionComponent, null);
			assert.equal(noCriteriaResultsComponent, null);
			assert.equal(list._loading, true);
		});
		test('if there is no data in the list, d2l-evaluation-hub-no-submissions-image is shown', (done) => {
			loadPromise('data/emptyUnassessedActivities.json').then(function() {
				var noSubmissionComponent = list.shadowRoot.querySelector('.d2l-quick-eval-no-submissions');
				assert.notEqual(noSubmissionComponent.style.display, 'none');
				var noCriteriaResultsComponent = list.shadowRoot.querySelector('.d2l-evaluation-hub-no-criteria-results');
				assert.equal(noCriteriaResultsComponent, null);
				//This is here because of how dom-if works, we need to load activities once to ensure we actually
				//render the d2l-quick-eval-no-submissions component and instantly hide it.
				loadPromise('data/unassessedActivities.json').then(function() {
					var noSubmissionComponent = list.shadowRoot.querySelector('.d2l-quick-eval-no-submissions');
					assert.equal(noSubmissionComponent.style.display, 'none');
					done();
				});
			});
		});
		test('if there is no data in the list and filters/search has been applied, d2l-evaluation-hub-no-criteria-results-image is shown', (done) => {
			list.setAttribute('criteria-applied', '');

			loadPromise('data/emptyUnassessedActivities.json').then(function() {
				var noCriteriaResultsComponent = list.shadowRoot.querySelector('.d2l-evaluation-hub-no-criteria-results');
				assert.notEqual(noCriteriaResultsComponent.style.display, 'none');
				var noSubmissionComponent = list.shadowRoot.querySelector('.d2l-quick-eval-no-submissions');
				assert.equal(noSubmissionComponent, null);
				//This is here because of how dom-if works, we need to load activities once to ensure we actually
				//render the d2l-evaluation-hub-no-criteria-results component and instantly hide it.
				loadPromise('data/unassessedActivities.json').then(function() {
					var noCriteriaResultsComponent = list.shadowRoot.querySelector('.d2l-evaluation-hub-no-criteria-results');
					assert.equal(noCriteriaResultsComponent.style.display, 'none');
					done();
				});
			});
		});
		test('headers display correctly', function(done) {
			flush(function() {
				var headers = list.shadowRoot.querySelectorAll('d2l-th');

				assert.equal(expectedColumnHeaders.length, headers.length);

				for (var i = 0; i < expectedColumnHeaders.length; i++) {
					expectedColumnHeaders[i].forEach(function(expectedHeader) {
						assert.include(headers[i].innerHTML, expectedHeader);
					});
				}
				done();
			});
		});
		test('headers include master teacher when toggled on, and is display correctly', function(done) {
			list.setAttribute('master-teacher', '');

			flush(function() {

				var headers = list.shadowRoot.querySelectorAll('d2l-th');
				assert.equal(expectedColumnHeadersWithMasterTeacher.length, headers.length);

				for (var i = 0; i < expectedColumnHeadersWithMasterTeacher.length; i++) {
					expectedColumnHeadersWithMasterTeacher[i].forEach(function(expectedHeader) {
						assert.include(headers[i].innerHTML, expectedHeader);
					});
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
				flush(function() {
					verifyData(expected, done);
				});
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

			loadPromise('data/unassessedActivities.json').then(function() {
				var loadMore = list.shadowRoot.querySelector('.d2l-evaluation-hub-activities-list-load-more');
				var loadMoreContainer = list.shadowRoot.querySelector('.d2l-evaluation-hub-activities-list-load-more-container');
				var verify = function() {
					if (!list._loading && loadMoreContainer.style.display === 'none') {
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
		test('when handling load more failure, alert should pop up and alert should hide when alerts cleared', (done) => {
			list._handleLoadMoreFailure();

			flush(function() {
				var alert = list.shadowRoot.querySelector('#list-alert');
				assert.equal(false, alert.hasAttribute('hidden'));

				list._clearAlerts();
				flush(function() {
					assert.equal(true, alert.hasAttribute('hidden'));
					done();
				});

			});
		});
		test('when handling initial load failure, alert should pop up and alert should hide when alerts cleared', (done) => {
			list._handleFullLoadFailure();

			flush(function() {
				var alert = list.shadowRoot.querySelector('#list-alert');
				assert.equal(false, alert.hasAttribute('hidden'));

				list._clearAlerts();
				flush(function() {
					assert.equal(true, alert.hasAttribute('hidden'));
					done();
				});

			});
		});
		test('when calling perform siren action with no query params and no fields, the fields are empty', () => {

			const action = {
				href : 'http://127.0.0.1/',
				name: 'apply',
				type: 'application/x-www-form-urlencoded',
				method: 'GET'
			};

			const stub = sinon.stub(list, 'performSirenAction', function(passedAction) {
				assert.deepEqual(action, passedAction);
			});

			list._performSirenActionWithQueryParams(action);
			sinon.assert.calledWith(stub, action);
		});
		test('when calling perform siren action with no query params, the fields are not modified', () => {

			const action = {
				href : 'http://127.0.0.1/',
				name: 'apply',
				type: 'application/x-www-form-urlencoded',
				method: 'GET',
				fields : [
					{
						type: 'hidden',
						name : 'existingField',
						value: 'existingValue'
					}]
			};

			const stub = sinon.stub(list, 'performSirenAction', function(passedAction) {
				assert.deepEqual(action, passedAction);
			});

			list._performSirenActionWithQueryParams(action);
			sinon.assert.calledWith(stub, action);
		});
		test('when calling perform siren action with query params, the query params are added as fields', () => {

			const action = {
				href : 'http://127.0.0.1?testname=testvalue&anothertestname=anothertestvalue',
				name: 'apply',
				type: 'application/x-www-form-urlencoded',
				method: 'GET',
				fields : [
					{
						type: 'hidden',
						name : 'existingField',
						value: 'existingValue'
					}]
			};

			const expectedAction = {
				href : 'http://127.0.0.1?testname=testvalue&anothertestname=anothertestvalue',
				name: 'apply',
				type: 'application/x-www-form-urlencoded',
				method: 'GET',
				fields : [
					{
						type: 'hidden',
						name : 'existingField',
						value: 'existingValue'
					},
					{
						type: 'hidden',
						name : 'testname',
						value: 'testvalue'
					},
					{
						type: 'hidden',
						name : 'anothertestname',
						value: 'anothertestvalue'
					}]
			};

			const stub = sinon.stub(list, 'performSirenAction', function(passedAction) {
				assert.deepEqual(expectedAction, passedAction);
			});

			list._performSirenActionWithQueryParams(action);
			sinon.assert.calledWith(stub, action);
		});
		test('when parsing url for sort and filter params and url is null, return empty array', () => {

			var params = list._getExtraParams('');
			assert.equal(params.length, 0);
		});
		test('when parsing url for sort and filter params and url is null, return empty array', () => {

			var params = list._getExtraParams(null);
			assert.equal(params.length, 0);
		});
		test('when parsing url for sort and filter params, if they are both present, return array with correct values', () => {
			const url = 'https://www.example.com/?pageSize=20&filter=96W3siU29ydCI6eyJJ&sort=Y3Rpb24iOjB9';

			var params = list._getExtraParams(url);
			assert.equal(params.length, 2);

			const expectedParams = [
				{
					name: 'filter',
					value: '96W3siU29ydCI6eyJJ'
				},
				{
					name: 'sort',
					value: 'Y3Rpb24iOjB9'
				}
			];
			assert.deepEqual(params, expectedParams);
		});
		test('when parsing url for sort and filter params, if only sort is present, return array with correct values', () => {
			const url = 'https://www.example.com/?pageSize=20&sort=Y3Rpb24iOjB9';

			var params = list._getExtraParams(url);
			assert.equal(params.length, 1);

			const expectedParams = [
				{
					name: 'sort',
					value: 'Y3Rpb24iOjB9'
				}
			];
			assert.deepEqual(params, expectedParams);
		});
		test('when parsing url for sort and filter params, if only filter is present, return array with correct values', () => {
			const url = 'https://www.example.com/?pageSize=20&filter=96W3siU29ydCI6eyJJ';

			var params = list._getExtraParams(url);
			assert.equal(params.length, 1);

			const expectedParams = [
				{
					name: 'filter',
					value: '96W3siU29ydCI6eyJJ'
				}
			];
			assert.deepEqual(params, expectedParams);
		});
		test('when creating the evaluation link, if there are no extra params, return original link', () => {
			const url = '/d2l/lms/tool/mark.d2l?ou=122041&db=1004';
			const params = [];

			var evalLink = list._buildRelativeUri(url, params);
			assert.equal(evalLink, url);
		});
		test('when creating the evaluation link, if there are extra params, return correct link', () => {
			const url = '/d2l/lms/tool/mark.d2l?ou=122041&db=1004';
			const params = [
				{
					name: 'filter',
					value: '96W3siU29ydCI6eyJJ'
				},
				{
					name: 'sort',
					value: 'Y3Rpb24iOjB9'
				}
			];
			const expectedEvalLink = url + '&filter=96W3siU29ydCI6eyJJ&sort=Y3Rpb24iOjB9';

			var evalLink = list._buildRelativeUri(url, params);
			assert.equal(evalLink, expectedEvalLink);
		});
		test('when creating the evaluation link, if there are extra params and url has no original params, return correct link', () => {
			const url = '/d2l/lms/tool/122041/mark/1004/';
			const params = [
				{
					name: 'filter',
					value: '96W3siU29ydCI6eyJJ'
				},
				{
					name: 'sort',
					value: 'Y3Rpb24iOjB9'
				}
			];
			const expectedEvalLink = url + '?filter=96W3siU29ydCI6eyJJ&sort=Y3Rpb24iOjB9';

			var evalLink = list._buildRelativeUri(url, params);
			assert.equal(evalLink, expectedEvalLink);
		});

	});
})();
