'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangZhtwImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.zhtw = {
			'activityName': '活動名稱',
			'courseName': '課程',
			'displayName': '名字，姓氏',
			'loading': 'Loading',
			'loadMore': '載入更多',
			'submissionDate': '提交日期',
			'masterTeacher': 'Master Teacher'
		};
	}
};

export const LangZhtw = dedupingMixin(LangZhtwImpl);

