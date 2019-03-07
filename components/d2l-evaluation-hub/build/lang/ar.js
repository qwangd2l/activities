'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangArImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.ar = {
			'activityName': 'اسم النشاط',
			'caughtUp': 'You\'re all caught up!',
			'checkBackOften': 'Check back often for new submissions.',
			'courseName': 'المقرر التعليمي',
			'displayName': 'الاسم الأول، اسم العائلة',
			'loading': 'Loading',
			'loadMore': 'تحميل المزيد',
			'masterTeacher': 'Master Teacher',
			'noSubmissions': 'There are no submissions that need your attention.',
			'submissionDate': 'تاريخ الإرسال'
		};
	}
};

export const LangAr = dedupingMixin(LangArImpl);

