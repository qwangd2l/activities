'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangFiImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.fi = {
			'activityName': 'Activity Name',
			'courseName': 'Course',
			'displayName': 'First Name, Last Name',
			'loadMore': 'Load more',
			'submissionDate': 'Submission Date'
		};
	}
};

export const LangFi = dedupingMixin(LangFiImpl);

