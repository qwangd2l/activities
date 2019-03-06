'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangEnImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.en = {
			'activityName': 'Activity Name',
			'courseName': 'Course',
			'displayName': 'First Name, Last Name',
			'loading': 'Loading',
			'loadMore': 'Load more',
			'masterTeacher': 'Master Teacher',
			'submissionDate': 'Submission Date',
			'caughtUp': 'You\'re all caught up!',
			'noSubmissions': 'There are no submissions that need your attention.',
			'checkBackOften': 'Check back often for new submissions.'
		};
	}
};

export const LangEn = dedupingMixin(LangEnImpl);

