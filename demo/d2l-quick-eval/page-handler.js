import { parseSortFromUrl, encodeSortState, decodeSortState } from './sort-handler';
import { formatActivities } from './activity-handler';
import chunk from 'lodash-es/chunk';

function getQueryParamOrDefault(
	relativeUrl,
	queryParam,
	defaultValue
) {
	const baseUrl = 'http://www.test.com/'
	const fullUrl = new URL(baseUrl + relativeUrl);

	return fullUrl.searchParams.get(queryParam) || defaultValue;
}

function setQueryParam(
	relativeUrl,
	queryParam,
	value
) {
	const baseUrl = 'http://www.test.com/'
	const fullUrl = new URL(baseUrl + relativeUrl);
	fullUrl.searchParams.set(queryParam, value);

	return fullUrl.pathname.substr(1) + '?' + fullUrl.searchParams.toString();
}

function applySorts(activities, sorts, sortState) {
	sortState.reverse().forEach(appliedSort => {
		const sortDefn = sorts.filter(s => s.id === appliedSort.id)[0];

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

function createPageEndpoint(activities, sorts, pageSize, pageNumber, filtersHref, sortsHref, nextPageHref, failFirstTime) {
	var shouldFail = failFirstTime;

	return (url) => {

		const bookmark = parseInt( getQueryParamOrDefault(url, 'bookmark', 0) );
		const nextBookmark = bookmark + parseInt( pageSize ) ;

		const serializedSortState = parseSortFromUrl(url);
		const sortState = decodeSortState(serializedSortState);

		const sortedActivities = applySorts(activities, sorts, sortState);
		const formattedSortedActivities = formatActivities(sortedActivities);
		const pagedActivities = formattedSortedActivities.slice(bookmark, Math.min(formattedSortedActivities.length, nextBookmark));

		const nextPageHrefWithBookmark = setQueryParam(url, 'bookmark', nextBookmark);
		const nextPageHrefWithBookmarkAndSort = setQueryParam(nextPageHrefWithBookmark, 'sort', encodeSortState(sortState));

		const nextSortHrefWithBookmark = setQueryParam(sortsHref, 'bookmark', nextBookmark);
		const nextSortHrefWithBookmarkAndSort = setQueryParam(nextSortHrefWithBookmark, 'sort', encodeSortState(sortState));

		if (shouldFail) {
			shouldFail = false;
			throw new Error('simulated error');
		}
		const hasMoreActivities = nextBookmark < activities.length;


		return formatPage(pagedActivities, filtersHref, nextSortHrefWithBookmarkAndSort, nextPageHrefWithBookmarkAndSort, hasMoreActivities);
	};
}

function formatPage(entities, filterLocation, sortsLocation, nextLocation, hasMoreActivities) {

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

	if (hasMoreActivities) {
		entity.links.push({
			'rel': [
				'next'
			],
			'href': nextLocation
		});
	}

	return entity;
}

export { createPageEndpoint, formatPage };
