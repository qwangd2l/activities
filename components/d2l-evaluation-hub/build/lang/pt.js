'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangPtImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.pt = {
			'activityName': 'Nome da Atividade',
			'courseName': 'Curso',
			'displayName': 'Nome e Sobrenome',
			'loading': 'Loading',
			'loadMore': 'Carregar mais',
			'masterTeacher': 'Master Teacher',
			'submissionDate': 'Data do Envio'
		};
	}
};

export const LangPt = dedupingMixin(LangPtImpl);

