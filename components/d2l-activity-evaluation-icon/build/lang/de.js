'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangDeImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.de = {
			'draftInfo': 'Bewertung als Entwurf gespeichert'
		};
	}
};

export const LangDe = dedupingMixin(LangDeImpl);

