'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangZhImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.zh = {
			'enroll': 'Enroll'
		};
	}
};

export const LangZh = dedupingMixin(LangZhImpl);

