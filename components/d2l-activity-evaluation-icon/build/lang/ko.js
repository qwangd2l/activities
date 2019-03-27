'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangKoImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.ko = {
			'draftInfo': '초안으로 평가 저장됨'
		};
	}
};

export const LangKo = dedupingMixin(LangKoImpl);

