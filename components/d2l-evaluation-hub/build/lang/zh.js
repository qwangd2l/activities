'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangZhImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.zh = {
			'activityName': '活动名称',
			'caughtUp': 'You\'re all caught up!',
			'checkBackOften': 'Check back often for new submissions.',
			'courseName': '课程',
			'displayName': '名字，姓氏',
			'loading': 'Loading',
			'loadMore': '加载更多',
			'masterTeacher': 'Master Teacher',
			'noSubmissions': 'There are no submissions that need your attention.',
			'submissionDate': '提交日期'
		};
	}
};

export const LangZh = dedupingMixin(LangZhImpl);

