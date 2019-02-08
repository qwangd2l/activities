'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangZhImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.zh = {
			'activityName': '活动名称',
			'courseName': '课程',
			'displayName': '名字，姓氏',
			'loading': 'Loading data',
			'loadMore': '加载更多',
			'submissionDate': '提交日期'
		};
	}
};

export const LangZh = dedupingMixin(LangZhImpl);

