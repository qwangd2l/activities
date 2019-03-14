import {Rels} from 'd2l-hypermedia-constants';
import SirenParse from 'siren-parser';

function findSortHeader(list, sortClass) {
	return list._headerColumns
		.map(column => column.headers)
		.reduce((acc, val) => acc.concat(val), [])  // ie11 flatten
		.reduce((acc, val) => val.sortClass === sortClass ? val : acc, undefined); // ie11 find
}

function resetSortHeaders(list) {
	list._headerColumns.forEach(column => {
		column.headers.forEach(header => {
			header.canSort = false;
			header.sorted = false;
			header.desc = false;
		});
	});
}

function stubPerformSirenAction(list, mappings) {
	const oldPerformSirenAction = list.performSirenAction.bind(list);

	list.performSirenAction = (action, fields) => {
		if (mappings[action.name]) {
			return Promise.resolve(SirenParse(mappings[action.name]));
		}
		return oldPerformSirenAction(action, fields);
	};
}

function stubFollowLink(list, mappings) {
	const oldFollowLink = list._followLink.bind(list);

	list._followLink = (entity, rel) => {
		if (mappings[rel]) {
			return Promise.resolve({ entity: SirenParse(mappings[rel]) });
		}
		return oldFollowLink(entity, rel);
	};

	return oldFollowLink;
}

function enableSorts(list, sorts) {
	const sortEntities = sorts.map(formatSimpleSort);
	const sortsEntity = formatSimpleSorts(sortEntities);

	const mappings = {};
	mappings[Rels.sorts] = sortsEntity;
	return stubFollowLink(list, mappings);
}

suite('d2l-evaluation-hub-activities-list-sorting', () => {
	let list;

	setup(function() {
		list = fixture('basic');
		// huge hack, not sure why fixture is not resetting them
		resetSortHeaders(list);
	});

	test('sorting is disabled on all columns by default', () => {
		expect(list._headerColumns.filter(column => column.headers.some(h => h.canSort))).to.be.empty;
	});

	test('_loadSorts silently does nothing on null entity', () => {
		return list._loadSorts(null);
	});

	test('_loadSorts determines which headers are sortable', () => {
		const enabledSortClasses = ['activity-name', 'course-name'];
		enableSorts(list, enabledSortClasses);

		const entity = formatCollection();

		return list._loadSorts(entity)
			.then(() => {
				const enabledSorts = list._headerColumns
					.map (column => column.headers)
					.reduce((acc, val) => acc.concat(val), []) // flatten
					.filter(h => h.canSort)
					.map(h => h.sortClass);

				expect(enabledSorts).to.have.same.members(enabledSortClasses);
			});
	});

	test('_loadSorts rejects on bad sort entity', (done) => {
		const mappings = {};
		mappings[Rels.sorts] = null;
		stubFollowLink(list, mappings);

		const entity = formatCollection();

		list._loadSorts(entity)
			.then(() => {
				done('_loadSorts should have rejected');
			})
			.catch((err) => {
				expect(err.toString()).to.equal('Error: Could not load sorts endpoint');
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	test('_updateSortState a header we can\'t find does nothing', (done) => {
		const e = {
			currentTarget: {}
		};

		list._updateSortState(e)
			.then(() => {
				done('_updateSortState should have rejected');
			})
			.catch((err) => {
				expect(err.toString()).to.equal('Error: Could not find sortable header for undefined');
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	test('_updateSortState an unsortable header does nothing', (done) => {
		const e = {
			currentTarget: {
				id: 'activityName'
			}
		};

		list._updateSortState(e)
			.then(() => {
				done('_updateSortState should have rejected');
			})
			.catch((err) => {
				expect(err.toString()).to.equal('Error: Could not find sortable header for activityName');
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	test('clicking a header sorts column ascending', () => {
		const mappings = {};
		mappings['sort-ascending'] = formatSimpleSorts([]);
		mappings['apply'] = formatCollection();
		stubPerformSirenAction(list, mappings);
		const enabledSort = 'activity-name';
		enableSorts(list, [enabledSort]);

		const e = {
			currentTarget: {
				id: 'activityName'
			}
		};

		return list._loadSorts(formatCollection())
			.then(() => {
				return list._updateSortState(e).then(() => {
					expect(list.entity).to.deep.equal(SirenParse(mappings['apply']));
					expect(findSortHeader(list, enabledSort).desc).to.be.false;
					expect(findSortHeader(list, enabledSort).sorted).to.be.true;
				});
			});
	});

	test('clicking a header twice sorts column descending', () => {
		const mappings = {};
		mappings['sort-ascending'] = formatSimpleSorts([]);
		mappings['sort-descending'] = formatSimpleSorts([]);
		mappings['apply'] = formatCollection();
		stubPerformSirenAction(list, mappings);
		const enabledSort = 'activity-name';
		enableSorts(list, [enabledSort]);

		const e = {
			currentTarget: {
				id: 'activityName'
			}
		};
		return list._loadSorts(formatCollection())
			.then(() => {
				return list._updateSortState(e).then(() => {
					return list._updateSortState(e).then(() => {
						expect(list.entity).to.deep.equal(SirenParse(mappings['apply']));
						expect(findSortHeader(list, enabledSort).desc).to.be.true;
						expect(findSortHeader(list, enabledSort).sorted).to.be.true;
					});
				});
			});
	});

});

function formatCollection() {
	return {
		'links': [
			{
				'rel': [
					Rels.sorts
				],
				'href': 'not used'
			}
		],
		'entities': []
	};
}

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

function formatSimpleSort(klass) {
	return {
		rel: ['https://api.brightspace.com/rels/sort'],
		class: ['sort', klass],
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
