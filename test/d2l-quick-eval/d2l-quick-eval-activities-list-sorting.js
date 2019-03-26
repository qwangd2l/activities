import {Rels} from 'd2l-hypermedia-constants';
import SirenParse from 'siren-parser';

function resetSortHeaders(list) {
	list._headerColumns.forEach(column => {
		column.headers.forEach(header => {
			header.canSort = false;
			header.sorted = false;
			header.desc = false;
		});
	});
}

function stubLoadSorts(list, entity, enabledSorts) {
	const stub = sinon.stub(list, '_followLink');

	const sortEntity = {
		entities: enabledSorts.map(sort => formatSort(sort.className, sort.applied, sort.direction, sort.priority))
	};

	stub.withArgs(entity, Rels.sorts).returns(Promise.resolve({ entity: SirenParse(sortEntity) }));

	return stub;
}

suite('d2l-quick-eval-activities-list-sorting', () => {
	let list;

	setup(function() {
		list = fixture('basic');
		// huge hack, not sure why fixture is not resetting them
		resetSortHeaders(list);
	});

	test('sorting is disabled on all columns by default', () => {
		expect(list._headerColumns.filter(column => column.headers.some(h => h.canSort))).to.be.empty;
	});

	suite('_loadSorts', () => {
		test('_loadSorts silently does nothing on null entity', () => {
			return list._loadSorts(null);
		});

		suite('_loadSorts error cases', () => {
			const testData = [
				{
					name: 'null sortEntity',
					sortEntity: Promise.resolve(null)
				},
				{
					name: 'null sortEntity.entity',
					sortEntity: Promise.resolve({ entity: null })
				},
				{
					name: '_followLink rejection',
					sortEntity: Promise.reject()
				}
			];

			testData.forEach(testCase => {
				test('_loadSorts rejects on ' + testCase.name, (done) => {
					const stub = sinon.stub(list, '_followLink');
					const entity = {};

					stub.withArgs(entity, Rels.sorts)
						.returns(testCase.sortEntity);

					list._loadSorts(entity)
						.then(() => {
							done('_loadSorts should have rejected');
						})
						.catch(() => {
							done();
						})
						.catch((err) => {
							done(err);
						});
				});
			});
		});

		test('_loadSorts determines which headers are sortable', () => {
			const enabledSortClasses = [{ className:'activity-name' }, {className: 'course-name' }];
			const entity = {};

			stubLoadSorts(list, entity, enabledSortClasses);

			return list._loadSorts(entity)
				.then(() => {
					const enabledSorts = list._headerColumns
						.map(column => column.headers)
						.reduce((acc, val) => acc.concat(val), []) // flatten
						.filter(h => h.canSort)
						.map(h => h.sortClass);

					expect(enabledSorts).to.have.same.members(enabledSortClasses.map(x => x.className));
				});
		});
		test('_loadSorts only sets the primary sort header to sorted', () => {
			const enabledSortClasses = [
				{ className: 'first-name', applied: true, direction: 'descending', priority: 0 },
				{ className: 'completion-date', applied: true, direction: 'ascending', priority: 1 },
				{ className: 'last-name', applied: false }
			];
			const entity = {};

			stubLoadSorts(list, entity, enabledSortClasses);

			return list._loadSorts(entity)
				.then(() => {
					const activeSorts = list._headerColumns
						.map(column => column.headers)
						.reduce((acc, val) => acc.concat(val), []) // flatten
						.filter(h => h.sorted);

					expect(activeSorts).to.have.lengthOf(1);
					expect(activeSorts[0]).to.have.property('sortClass', 'first-name');
					expect(activeSorts[0]).to.have.property('desc', true);
				});
		});
	});

	suite('_updateSortState', () => {
		suite('_updateSortState error cases', () => {
			const testData = [
				{
					name: 'header not found',
					currentTarget: {}
				},
				{
					name: 'unsortable header',
					currentTarget: 'activityName'
				}
			];
			testData.forEach(testCase => {
				test(testCase.name, (done) => {
					var stub = sinon.stub(list, '_fetchSortedData');
					const e = {
						currentTarget: testCase.currentTarget
					};

					list._updateSortState(e)
						.then(() => {
							done('_updateSortState should have rejected');
						})
						.catch(() => {
							expect(stub.notCalled, '_fetchSortedData should not be called').to.be.true;
							done();
						})
						.catch((err) => {
							done(err);
						});
				});
			});
		});

		suite('_updateSortState only sets sortable header to sorted', () => {
			const testData = [
				{
					name: 'ascending',
					desc: false
				},
				{
					name: 'descending',
					desc: true
				}
			];

			testData.forEach(testCase => {
				test(testCase.name, () => {
					const activeSortKey = 'activityName';
					const stub = sinon.stub(list, '_fetchSortedData', () => Promise.resolve());
					const e = {
						currentTarget: {
							id: activeSortKey
						}
					};

					list._headerColumns.forEach(column => {
						column.headers.forEach(header => {
							if (header.key === activeSortKey) {
								header.canSort = true;
								header.desc = !testCase.desc;
								header.sorted = testCase.desc;
							}
						});
					});

					return list._updateSortState(e)
						.then(() => {
							const activeSorts = list._headerColumns
								.map(column => column.headers)
								.reduce((acc, val) => acc.concat(val), []) // flatten
								.filter(h => h.sorted);

							expect(activeSorts).to.have.lengthOf(1);
							expect(activeSorts[0]).to.have.property('key', activeSortKey);
							expect(activeSorts[0]).to.have.property('desc', testCase.desc);
							expect(stub.withArgs('activity-name', testCase.desc).calledOnce).to.be.true;
						});
				});
			});
		});
	});

	suite('_fetchSortedData', () => {
		test('_fetchSortedData correctly fetches data', () => {
			const appliedSortClass = 'activity-name';
			const activityNameSort = formatSort(appliedSortClass);
			const sorts = SirenParse(formatSimpleSorts([activityNameSort]));
			const sortAction = sorts.getSubEntityByClass(appliedSortClass).getActionByName('sort-ascending');
			const applyAction = sorts.getActionByName('apply');
			const collection = {};

			const followLinkStub = sinon.stub(list, '_followLink');
			const performActionStub = sinon.stub(list, '_performSirenActionWithQueryParams');
			const sortUpdatedStub = sinon.stub(list, '_dispatchSortUpdatedEvent');
			const loadDataStub = sinon.stub(list, '_loadData');
			const loadSortsStub = sinon.stub(list, '_loadSorts');

			followLinkStub.withArgs(list.entity, Rels.sorts).returns(Promise.resolve({ entity: sorts }));
			performActionStub.withArgs(sortAction).returns(sorts);
			performActionStub.withArgs(applyAction, undefined).returns(collection);

			return list._fetchSortedData('activity-name', false)
				.then(actual => {
					expect(sortUpdatedStub.withArgs(collection).calledOnce).to.be.true;
					expect(loadDataStub.withArgs(collection).calledOnce).to.be.true;
					expect(loadSortsStub.withArgs(collection).calledOnce).to.be.true;
					expect(actual).to.deep.equal(collection);
				});
		});
	});
});

function formatSimpleSorts(sortEntities) {
	return {
		entities: sortEntities,
		actions: [
			{
				name: 'apply',
				href: '/collection',
				fields: [
					{
						class: ['base64', 'json'],
						type: 'hidden',
						name: 'sort',
						value: 'sortState'
					}
				]
			}
		]
	};
}

function formatSort(klass, applied, direction, priority) {
	return {
		rel: ['https://api.brightspace.com/rels/sort'],
		class: ['sort', klass],
		properties: {
			applied: applied,
			direction: direction,
			priority: priority
		},
		actions: [
			{
				name: 'sort-ascending',
				href: '/sorts',
				fields: [
					{
						type: 'hidden',
						name: 'sort',
						value: `${klass}-asc`
					}
				]
			},
			{
				name: 'sort-descending',
				href: '/sorts',
				fields: [
					{
						type: 'hidden',
						name: 'sort',
						value: `${klass}-desc`
					}
				]
			}
		]
	};
}
