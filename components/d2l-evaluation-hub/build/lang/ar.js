'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangArImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.ar = {
			'activityName': 'Activity Name',
			'courseName': 'Course Name',
			'displayName': 'Submitter',
			'loadMore': 'Load more',
			'submissionDate': 'Submission Date'
		};
	}
};

export const LangAr = dedupingMixin(LangArImpl);

