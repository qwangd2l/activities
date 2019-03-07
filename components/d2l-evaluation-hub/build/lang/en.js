'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangEnImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.en = {
			'activityName': 'Activity Name',
			'caughtUp': 'You\'re all caught up!',
			'checkBackOften': 'Check back often for new submissions.',
			'courseName': 'Course',
			'displayName': 'First Name, Last Name',
			'loading': 'Loading',
			'loadMore': 'Load more',
			'masterTeacher': 'Master Teacher',
			'noSubmissions': 'There are no submissions that need your attention.',
			'submissionDate': 'Submission Date'
		};
	}
};

export const LangEn = dedupingMixin(LangEnImpl);

