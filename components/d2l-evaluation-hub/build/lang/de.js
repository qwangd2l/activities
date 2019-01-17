'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangDeImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.de = {
			'activityName': 'Activity Name',
			'courseName': 'Course',
			'displayName': 'First Name, Last Name',
			'loadMore': 'Load more',
			'submissionDate': 'Submission Date'
		};
	}
};

export const LangDe = dedupingMixin(LangDeImpl);

