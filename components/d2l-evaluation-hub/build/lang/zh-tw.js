'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangZhtwImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.zhtw = {
			'activityName': '活動名稱',
			'caughtUp': 'You\'re all caught up!',
			'checkBackOften': 'Check back often for new submissions.',
			'courseName': '課程',
			'displayName': '名字，姓氏',
			'loading': 'Loading',
			'loadMore': '載入更多',
			'masterTeacher': 'Master Teacher',
			'noSubmissions': 'There are no submissions that need your attention.',
			'submissionDate': '提交日期'
		};
	}
};

export const LangZhtw = dedupingMixin(LangZhtwImpl);

