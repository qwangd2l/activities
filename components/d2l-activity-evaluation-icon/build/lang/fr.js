'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangFrImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.fr = {
			'draftInfo': 'Evaluation saved as draft'
		};
	}
};

export const LangFr = dedupingMixin(LangFrImpl);

