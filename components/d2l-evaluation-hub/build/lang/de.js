'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangDeImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.de = {
			'activityName': 'Name der Aktivität',
			'courseName': 'Kurs',
			'displayName': 'Vorname, Nachname',
			'loadMore': 'Mehr laden',
			'submissionDate': 'Abgabedatum'
		};
	}
};

export const LangDe = dedupingMixin(LangDeImpl);

