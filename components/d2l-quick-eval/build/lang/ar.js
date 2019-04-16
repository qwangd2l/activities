'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangArImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.ar = {
			'activityName': 'اسم النشاط',
			'caughtUp': 'You\'re all caught up!',
			'checkBackOften': 'Check back often for new submissions.',
			'clearSearch': 'مسح البحث',
			'courseName': 'المقرر التعليمي',
			'displayName': 'الاسم الأول، اسم العائلة',
			'evaluate': 'Evaluate {displayName}',
			'failedToFilter': 'Unable to apply filter. Try again in a few minutes.',
			'failedToLoadData': 'Unable to load submissions. Try again in a few minutes.',
			'failedToLoadMore': 'Unable to load more submissions. Try again in a few minutes.',
			'failedToSearch': 'Unable to apply search. Try again in a few minutes.',
			'firstName': 'First Name',
			'lastName': 'Last Name',
			'loadMore': 'تحميل المزيد',
			'loading': 'يتم الآن التحميل',
			'masterTeacher': 'Teacher',
			'noCriteriaMatch': 'There are no submissions that match your criteria.',
			'noResults': 'No results here.',
			'noSubmissions': 'There are no submissions that need your attention.',
			'search': 'Search',
			'searchResultsSingle': '1 نتيجة البحث',
			'searchResultsMultiple': '{num} نتائج البحث',
			'searchResultsMore': '{num}+ Search Results',
			'sortBy': 'Sort by {columnName}',
			'submissionDate': 'تاريخ الإرسال',
			'tableTitle': 'List of unevaluated Learner submissions from across courses and tools',
			'tryAgain': 'Try Again'
		};
	}
};

export const LangAr = dedupingMixin(LangArImpl);

