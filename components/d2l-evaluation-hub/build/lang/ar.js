'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangArImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.ar = {
			'activityName': 'اسم النشاط',
			'courseName': 'المقرر التعليمي',
			'displayName': 'الاسم الأول، اسم العائلة',
			'loading': 'Loading',
			'loadMore': 'تحميل المزيد',
			'submissionDate': 'تاريخ الإرسال'
		};
	}
};

export const LangAr = dedupingMixin(LangArImpl);

