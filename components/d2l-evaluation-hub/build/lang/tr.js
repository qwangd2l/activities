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
			'evaluate': 'Evaluate {displayName}',
			'failedToLoadData': 'Unable to load submissions. Try again in a few minutes.',
			'failedToLoadMore': 'Unable to load more submissions. Try again in a few minutes.',
			'firstName': 'First Name',
			'lastName': 'Last Name',
			'loadMore': 'Daha fazla yükle',
			'loading': 'Yükleniyor',
			'masterTeacher': 'Master Teacher',
			'noSubmissions': 'There are no submissions that need your attention.',
			'submissionDate': 'Gönderme Tarihi',
			'tableTitle': 'List of unevaluated Learner submissions from across courses and tools',
			'tryAgain': 'Try Again'
		};
	}
};

export const LangTr = dedupingMixin(LangTrImpl);

