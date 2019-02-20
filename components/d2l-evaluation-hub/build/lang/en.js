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
			'submissionDate': 'Submission Date',
			'masterTeacher': 'Master Teacher'
		};
	}
};

export const LangEn = dedupingMixin(LangEnImpl);

