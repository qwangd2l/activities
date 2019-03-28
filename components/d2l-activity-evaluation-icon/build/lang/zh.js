'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangZhImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.zh = {
			'draftInfo': '评估已另存为草稿'
		};
	}
};

export const LangZh = dedupingMixin(LangZhImpl);

