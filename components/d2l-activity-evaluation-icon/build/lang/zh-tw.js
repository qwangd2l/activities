'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangZhtwImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.zhtw = {
			'draftInfo': '評估內容已儲存為草稿'
		};
	}
};

export const LangZhtw = dedupingMixin(LangZhtwImpl);

