'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangZhImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.zh = {
			'activityName': 'Activity Name',
			'courseName': 'Course',
			'displayName': 'First Name, Last Name',
			'loadMore': 'Load more',
			'submissionDate': 'Submission Date'
		};
	}
};

export const LangZh = dedupingMixin(LangZhImpl);

