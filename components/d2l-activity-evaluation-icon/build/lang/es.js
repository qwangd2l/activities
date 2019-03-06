'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangEsImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.es = {
			'draftInfo': 'Evaluation saved as draft'
		};
	}
};

export const LangEs = dedupingMixin(LangEsImpl);

