'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangEsImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.es = {
			'enroll': 'Inscribirse'
		};
	}
};

export const LangEs = dedupingMixin(LangEsImpl);

