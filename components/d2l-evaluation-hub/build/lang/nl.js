'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangNlImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.nl = {
			'activityName': 'Naam activiteit',
			'caughtUp': 'You\'re all caught up!',
			'checkBackOften': 'Check back often for new submissions.',
			'courseName': 'Cursus',
			'displayName': 'Voornaam, achternaam',
			'loading': 'Loading',
			'loadMore': 'Meer laden',
			'masterTeacher': 'Master Teacher',
			'noSubmissions': 'There are no submissions that need your attention.',
			'submissionDate': 'Datum van indiening'
		};
	}
};

export const LangNl = dedupingMixin(LangNlImpl);

