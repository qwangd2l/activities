'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangZhImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.zh = {
			'draftInfo': 'Evaluation saved as draft'
		};
	}
};

export const LangZh = dedupingMixin(LangZhImpl);

