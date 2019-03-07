'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangJaImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.ja = {
			'activityName': 'アクティビティ名',
			'caughtUp': 'You\'re all caught up!',
			'checkBackOften': 'Check back often for new submissions.',
			'courseName': 'コース',
			'displayName': '名, 姓',
			'loading': 'Loading',
			'loadMore': 'さらに読み込む',
			'masterTeacher': 'Master Teacher',
			'noSubmissions': 'There are no submissions that need your attention.',
			'submissionDate': '送信日'
		};
	}
};

export const LangJa = dedupingMixin(LangJaImpl);

