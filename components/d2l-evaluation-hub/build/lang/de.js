'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangDeImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.de = {
			'activityName': 'Name der Aktivität',
			'caughtUp': 'You\'re all caught up!',
			'checkBackOften': 'Check back often for new submissions.',
			'courseName': 'Kurs',
			'displayName': 'Vorname, Nachname',
			'loading': 'Loading',
			'loadMore': 'Mehr laden',
			'masterTeacher': 'Master Teacher',
			'noSubmissions': 'There are no submissions that need your attention.',
			'submissionDate': 'Abgabedatum'
		};
	}
};

export const LangDe = dedupingMixin(LangDeImpl);

