'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangJaImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.ja = {
			'draftInfo': 'Evaluation saved as draft'
		};
	}
};

export const LangJa = dedupingMixin(LangJaImpl);

