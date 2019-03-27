'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangSvImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.sv = {
			'draftInfo': 'Utvärderingen sparades som utkast'
		};
	}
};

export const LangSv = dedupingMixin(LangSvImpl);

