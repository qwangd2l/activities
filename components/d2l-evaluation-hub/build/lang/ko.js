'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangKoImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.ko = {
			'activityName': '활동 이름',
			'courseName': '강의',
			'displayName': '이름, 성',
			'loading': 'Loading',
			'loadMore': '더 많이 로드',
			'masterTeacher': 'Master Teacher',
			'submissionDate': '제출일'
		};
	}
};

export const LangKo = dedupingMixin(LangKoImpl);

