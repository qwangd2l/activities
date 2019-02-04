'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangFrImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.fr = {
			'enroll': 'S'inscrire'
		};
	}
};

export const LangFr = dedupingMixin(LangFrImpl);

