'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangFrImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.fr = {
			'activityName': 'Nom de l\'activité',
			'caughtUp': 'You\'re all caught up!',
			'checkBackOften': 'Check back often for new submissions.',
			'clearSearch': 'Vider Rechercher',
			'courseName': 'Cours',
			'displayName': 'Prénom et Nom de famille',
			'evaluate': 'Evaluate {displayName}',
			'failedToFilter': 'Unable to apply filter. Try again in a few minutes.',
			'failedToLoadData': 'Unable to load submissions. Try again in a few minutes.',
			'failedToLoadMore': 'Unable to load more submissions. Try again in a few minutes.',
			'failedToSearch': 'Unable to apply search. Try again in a few minutes.',
			'firstName': 'First Name',
			'lastName': 'Last Name',
			'loadMore': 'En voir plus',
			'loading': 'Chargement',
			'masterTeacher': 'Teacher',
			'noCriteriaMatch': 'There are no submissions that match your criteria.',
			'noResults': 'No results here.',
			'noSubmissions': 'There are no submissions that need your attention.',
			'search': 'Search',
			'searchResultsSingle': '1 résultat de recherche',
			'searchResultsMultiple': '{num} résultats de recherche',
			'searchResultsMore': '{num}+ Search Results',
			'sortBy': 'Sort by {columnName}',
			'submissionDate': 'Date de soumission',
			'tableTitle': 'List of unevaluated Learner submissions from across courses and tools',
			'tryAgain': 'Try Again'
		};
	}
};

export const LangFr = dedupingMixin(LangFrImpl);

