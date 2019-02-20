'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangNlImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.nl = {
			'activityName': 'Naam activiteit',
			'courseName': 'Cursus',
			'displayName': 'Voornaam, achternaam',
			'loading': 'Loading',
			'loadMore': 'Meer laden',
			'submissionDate': 'Datum van indiening',
			'masterTeacher': 'Master Teacher'
		};
	}
};

export const LangNl = dedupingMixin(LangNlImpl);

