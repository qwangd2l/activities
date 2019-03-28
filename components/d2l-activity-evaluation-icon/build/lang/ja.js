'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangJaImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.ja = {
			'draftInfo': '評価が下書きとして保存されました'
		};
	}
};

export const LangJa = dedupingMixin(LangJaImpl);

