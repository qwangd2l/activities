'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangNlImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.nl = {
			'enroll': 'Inschrijven'
		};
	}
};

export const LangNl = dedupingMixin(LangNlImpl);

