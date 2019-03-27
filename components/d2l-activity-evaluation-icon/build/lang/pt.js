'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangPtImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.pt = {
			'draftInfo': 'Avaliação salva como rascunho'
		};
	}
};

export const LangPt = dedupingMixin(LangPtImpl);

