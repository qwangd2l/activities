'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangTrImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.tr = {
			'activityName': 'Etkinlik Adı',
			'caughtUp': 'You\'re all caught up!',
			'checkBackOften': 'Check back often for new submissions.',
			'courseName': 'Ders',
			'displayName': 'Ad, Soyad',
			'loading': 'Loading',
			'loadMore': 'Daha fazla yükle',
			'masterTeacher': 'Master Teacher',
			'noSubmissions': 'There are no submissions that need your attention.',
			'submissionDate': 'Gönderme Tarihi'
		};
	}
};

export const LangTr = dedupingMixin(LangTrImpl);

