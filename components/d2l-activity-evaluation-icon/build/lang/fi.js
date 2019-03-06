'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangFiImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.fi = {
			'draftInfo': 'Evaluation saved as draft'
		};
	}
};

export const LangFi = dedupingMixin(LangFiImpl);

