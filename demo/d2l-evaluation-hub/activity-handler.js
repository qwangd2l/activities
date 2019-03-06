function getHrefForActivityId(id) {
	return `activity/${id}`;
}

function formatActivity(activity, selfHref) {
	const formattedActivity = {
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
					'https://activities.api.brightspace.com/rels/user-activity-usage'
				],
				'href': selfHref
			},
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
					'date',
					'localized-formatted-date'
				],
				'rel': [
					'https://api.brightspace.com/rels/date'
				],
				'properties': {
					'date': '2019-03-13T15:16:10.793Z',
					'text': activity.localizedFormattedDate
				}
			}
		]
	};

	if (activity.isDraft) {
		const draftEntity = {
			'class': [
				'evaluation'
			],
			'rel': [
				'https://api.brightspace.com/rels/evaluation'
			],
			'properties': {
				'state': 'Draft'
			}
		};

		formattedActivity.entities.push(draftEntity);
	}

	return formattedActivity;
}

function formatActivities(activities) {
	const formattedActivities = [];

	activities.forEach((activity, i) => {
		const formattedActivity = formatActivity(activity, getHrefForActivityId(i));
		formattedActivities[i] = formattedActivity;
	});
	return formattedActivities;
}

function mapActivities(mappings, activities) {
	activities.forEach((activity, i) => {
		mappings[getHrefForActivityId(i)] = activity;
	});
	return mappings;
}

export { formatActivities, mapActivities };
