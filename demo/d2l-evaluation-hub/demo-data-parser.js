function formatName(firstName, lastName) {
	return firstName + ' ' + lastName;
}

function parseUsers(data) {
	const names = data.map(row => formatName(row.firstName, row.lastName));
	const uniqueNames = [... new Set(names)];

	return uniqueNames;
}

function formatUser(name) {
	return {
		'entities':[
			{
				'rel':['https://api.brightspace.com/rels/display-name'],
				'properties':{
					'name': name
				}
			}
		]
	};
}

function getHrefForUserId(id) {
	return `users/${id}`;
}

function parseActivityNames(data) {
	const activityNames = data.map(row => row.activityName);
	const uniqueActivityNames = [... new Set(activityNames)];

	return uniqueActivityNames;
}

function formatActivityName(name) {
	return {
		'properties':{
			'name': name
		}
	};
}

function getHrefForActivityNameId(id) {
	return `activities/${id}`;
}

function parseCourses(data) {
	const courseNames = data.map(row => row.courseName);
	const uniqueCourseNames = [... new Set(courseNames)];

	return uniqueCourseNames;
}

function formatCourse(name) {
	return {
		'properties':{
			'name': name
		}
	};
}

function getHrefForCourseId(id) {
	return `courses/${id}`;
}

const classMapping = {
	assignment: 'user-assignment-activity',
	quiz: 'user-quiz-attempt-activity',
	discussion: 'user-discussion-activity'
};

const relMapping = {
	assignment: 'https://api.brightspace.com/rels/assignment',
	quiz: 'https://api.brightspace.com/rels/quiz',
	discussion: 'https://discussions.api.brightspace.com/rels/topic'
};

function parseActivities(data, users, activityNames, courses) {
	const parsedActivities = data.map(row => {
		return {
			klass: classMapping[row.activityType],
			userHref: getHrefForUserId(users.indexOf(formatName(row.firstName, row.lastName))),
			courseHref: getHrefForCourseId(courses.indexOf(row.courseName)),
			activityRel: relMapping[row.activityType],
			activityHref: getHrefForActivityNameId(activityNames.indexOf(row.activityName)),
			submissionDate: row.submissionDate
		};
	});

	return parsedActivities;
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

function getHrefForPageId(id) {
	return `pages/${id}`;
}

function getHrefForNextPage(currentId, pages) {
	if (currentId + 1 < pages) {
		return getHrefForPageId(currentId + 1);
	}
}

function getMappings(data) {
	const users = parseUsers(data);
	const activityNames = parseActivityNames(data);
	const courses = parseCourses(data);
	const activities = parseActivities(data, users, activityNames, courses);

	const mappings = {};
	users.forEach((user, i) => {
		mappings[getHrefForUserId(i)] = formatUser(user);
	});
	activityNames.forEach((activityName, i) => {
		mappings[getHrefForActivityNameId(i)] = formatActivityName(activityName);
	});
	courses.forEach((course, i) => {
		mappings[getHrefForCourseId(i)] = formatCourse(course);
	});

	const pagedActivities = chunk(activities.map(a => formatActivity(a)), 3);
	const pages = pagedActivities.length;

	pagedActivities.forEach((page, i) => {
		mappings[getHrefForPageId(i)] = formatPage(page, 'filters/', 'sorts/', getHrefForNextPage(i, pages));
	});

	return mappings;
}

function chunk(array, count) {
	if (count === null || count < 1) return [];
	const result = [];
	let i = 0;
	const length = array.length;
	while (i < length) {
		result.push(Array.prototype.slice.call(array, i, i += count));
	}
	return result;
}

export default getMappings;
