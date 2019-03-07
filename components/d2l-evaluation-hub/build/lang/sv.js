'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangSvImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.sv = {
			'activityName': 'Aktivitetsnamn',
			'caughtUp': 'You\'re all caught up!',
			'checkBackOften': 'Check back often for new submissions.',
			'courseName': 'Kurs',
			'displayName': 'Förnamn, efternamn',
			'loading': 'Loading',
			'loadMore': 'Ladda mer',
			'masterTeacher': 'Master Teacher',
			'noSubmissions': 'There are no submissions that need your attention.',
			'submissionDate': 'Inlämningsdatum'
		};
	}
};

export const LangSv = dedupingMixin(LangSvImpl);

