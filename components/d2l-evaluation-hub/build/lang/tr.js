'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangTrImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.tr = {
			'activityName': 'Etkinlik Adı',
			'courseName': 'Ders',
			'displayName': 'Ad, Soyad',
			'loading': 'Loading',
			'loadMore': 'Daha fazla yükle',
			'submissionDate': 'Gönderme Tarihi',
			'masterTeacher': 'Master Teacher'
		};
	}
};

export const LangTr = dedupingMixin(LangTrImpl);

