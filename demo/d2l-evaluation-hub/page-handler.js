import { parseSortFromUrl, encodeSortState, decodeSortState } from './sort-handler';
import chunk from 'lodash-es/chunk';

function applySorts(activities, sorts, sortState) {
	sortState.forEach(appliedSort => {
		const sortDefn = sorts.find(s => s.id === appliedSort.id);

		let sortFn = sortDefn.fn;

		if (appliedSort.direction === 'd') {
			sortFn = (x, y) => -sortDefn.fn(x, y);
		}

		activities.sort(sortFn);
	});

	return activities;
}

function addSortToHref(href, sortState) {
	if (href) {
		if (sortState && sortState.length > 0) {
			return `${href}?sort=${encodeSortState(sortState)}`;
		}
		return href;
	}
}

function createPageEndpoint(activities, sorts, pageNumber, filtersHref, sortsHref, nextPageHref) {
	return (url) => {
		const serializedSortState = parseSortFromUrl(url);
		const sortState = decodeSortState(serializedSortState);

		const sortedActivities = applySorts(activities, sorts, sortState);
		const pagedActivities = chunk(sortedActivities.map(a => formatActivity(a)), 3);

		return formatPage(pagedActivities[pageNumber], filtersHref, sortsHref, addSortToHref(nextPageHref, sortState));
	};
}

function formatActivity(activity) {
	return {
		'class': [
			activity.klass,
			'activity'
		],
		'rel': [
			'https://activities.api.brightspace.com/rels/user-activity-usage'
		],
		'links': [
			{
				'rel': [
					'https://api.brightspace.com/rels/user'
				],
				'href': activity.userHref
			},
			{
				'rel': [
					'https://api.brightspace.com/rels/organization'
				],
				'href': activity.courseHref
			},
			{
				'rel': [
					activity.activityRel
				],
				'href': activity.activityHref
			}
		],
		'entities': [
			{
				'class': [
					'relative-uri'
				],
				'rel': [
					'item',
				],
				'properties': {
					'path': '/this/is/not/used'
				}
			},
			{
				'class': [
					'completion',
					'complete'
				],
				'rel': [
					'item'
				],
				'entities': [
					{
						'class': [
							'date',
							'completion-date'
						],
						'rel': [
							'https://api.brightspace.com/rels/date'
						],
						'properties': {
							'date': activity.submissionDate
						}
					}
				]
			}
		]
	};
}

function formatPage(entities, filterLocation, sortsLocation, nextLocation) {
	const entity = {
		'links': [
			{
				'rel': [
					'https://api.brightspace.com/rels/filters'
				],
				'href': filterLocation
			},
			{
				'rel': [
					'https://api.brightspace.com/rels/sorts'
				],
				'href': sortsLocation
			},

		],
		'entities': entities
	};

	if (nextLocation) {
		entity.links.push({
			'rel': [
				'next'
			],
			'href': nextLocation
		});
	}

	return entity;
}

export { createPageEndpoint };
