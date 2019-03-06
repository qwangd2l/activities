'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangZhtwImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.zhtw = {
			'draftInfo': 'Evaluation saved as draft'
		};
	}
};

export const LangZhtw = dedupingMixin(LangZhtwImpl);

