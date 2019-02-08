'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangEsImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.es = {
			'activityName': 'Nombre de la actividad',
			'courseName': 'Curso',
			'displayName': 'Nombre Apellido',
			'loading': 'Loading data',
			'loadMore': 'Cargar más',
			'submissionDate': 'Fecha del material enviado'
		};
	}
};

export const LangEs = dedupingMixin(LangEsImpl);

