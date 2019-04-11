import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {QuickEvalLocalize} from './QuickEvalLocalize.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import {Rels} from 'd2l-hypermedia-constants';
import 'd2l-typography/d2l-typography-shared-styles.js';
import 'd2l-alert/d2l-alert.js';
import 'd2l-common/components/d2l-hm-filter/d2l-hm-filter.js';
import 'd2l-common/components/d2l-hm-search/d2l-hm-search.js';
import './d2l-quick-eval-activities-list.js';
import './d2l-quick-eval-search-results-summary-container.js';

/**
 * @customElement
 * @polymer
 */
class D2LQuickEval extends mixinBehaviors([D2L.PolymerBehaviors.Siren.EntityBehavior], QuickEvalLocalize(PolymerElement)) {
	static get template() {
		return html`
			<style>
				:host {
					display: block;
				}
				h1 {
					@apply --d2l-heading-1;
					margin: 0;
				}
				.d2l-quick-eval-activity-list-modifiers {
					position: absolute;
					right: 0;
					bottom: 0;
				}
				:host(:dir(rtl)) .d2l-quick-eval-activity-list-modifiers {
					left: 0;
				}
				d2l-hm-search {
					display: inline-block;
					width: 250px;
					margin-left: 2rem;
				}
				.d2l-quick-eval-top-bar {
					padding-top: 0.25rem;
					position: relative;
				}
				d2l-quick-eval-activities-list {
					display: block;
					padding-top: 1rem;
				}
				d2l-alert {
					margin: auto;
					margin-bottom: 0.5rem;
				}
				d2l-quick-eval-search-results-summary-container {
					margin-bottom: 0.9rem;
					margin-top: 0.9rem;
					display: block;
				}
				[hidden] {
					display: none;
				}
			</style>
			<div class="d2l-quick-eval-top-bar">
				<template is="dom-if" if="[[headerText]]">
					<h1>[[headerText]]</h1>
				</template>
				<div class="d2l-quick-eval-activity-list-modifiers">
					<d2l-hm-filter
						href="[[_filterHref]]"
						token="[[token]]"
						category-whitelist="[[_filterIds]]"
						result-size="[[_numberOfActivitiesToShow]]">
					</d2l-hm-filter>
					<d2l-hm-search 
						hidden$="[[!searchEnabled]]" 
						token="[[token]]" 
						search-action="[[_searchAction]]" 
						placeholder="[[localize('search')]]"
						result-size="[[_numberOfActivitiesToShow]]"
						aria-label="[[localize('search')]]">
					</d2l-hm-search>
				</div>
			</div>
			<d2l-alert type="critical" hidden$="[[!_showFilterError]]" id="d2l-quick-eval-filter-error-alert">
				[[localize('failedToFilter')]]
			</d2l-alert>
			<d2l-alert type="critical" hidden$="[[!_showSearchError]]" id="d2l-quick-eval-search-error-alert">
				[[localize('failedToSearch')]]
			</d2l-alert>
			<d2l-quick-eval-search-results-summary-container search-results-count="[[_searchResultsCount]]" hidden$="[[!_searchResultsMessageEnabled(_showSearchResultSummary, searchEnabled)]]"></d2l-quick-eval-search-results-summary-container>
			<d2l-quick-eval-activities-list href="[[href]]" token="[[token]]" master-teacher="[[masterTeacher]]"></d2l-quick-eval-activities-list>
		`;
	}

	static get properties() {
		return {
			headerText: {
				type: String
			},
			masterTeacher: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			},
			searchEnabled: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			},
			_filterHref: {
				type: String,
				computed: '_getFilterHref(entity)'
			},
			_searchAction: {
				type: Object,
				computed: '_getSearchAction(entity)'
			},
			_filterIds: {
				type: Array,
				computed: '_getFilterIds(masterTeacher)'
			},
			_numberOfActivitiesToShow: {
				type: Number,
				value: 20
			},
			_showFilterError: {
				type: Boolean,
				value: false
			},
			_showSearchError: {
				type: Boolean,
				value: false
			},
			_showSearchResultSummary: {
				type: Boolean,
				value: false
			},
			_searchResultsCount: {
				type: Number,
				value: 0
			}
		};
	}

	static get is() { return 'd2l-quick-eval'; }

	attached()  {
		this.addEventListener('d2l-hm-filter-filters-loaded', this._filtersLoaded);
		this.addEventListener('d2l-hm-filter-filters-updating', this._filtersUpdating);
		this.addEventListener('d2l-hm-filter-filters-updated', this._filtersChanged);
		this.addEventListener('d2l-hm-filter-error', this._filterError);
		this.addEventListener('d2l-quick-eval-activities-list-sort-updated', this._sortChanged);
		this.addEventListener('d2l-hm-search-results-loading', this._searchResultsLoading);
		this.addEventListener('d2l-hm-search-results-loaded', this._searchResultsLoaded);
		this.addEventListener('d2l-quick-eval-search-results-summary-container-clear-search', this._clearSearchResults);
		this.addEventListener('d2l-hm-search-error', this._searchError);
		this.addEventListener('d2l-quick-eval-activities-list-activities-shown-number-updated', this._updateNumberOfActivitiesToShow);
	}

	detached() {
		this.removeEventListener('d2l-hm-filter-filters-loaded', this._filtersLoaded);
		this.removeEventListener('d2l-hm-filter-filters-updating', this._filtersUpdating);
		this.removeEventListener('d2l-hm-filter-filters-updated', this._filtersChanged);
		this.removeEventListener('d2l-hm-filter-error', this._filterError);
		this.removeEventListener('d2l-quick-eval-activities-list-sort-updated', this._sortChanged);
		this.removeEventListener('d2l-hm-search-results-loading', this._searchResultsLoading);
		this.removeEventListener('d2l-hm-search-results-loaded', this._searchResultsLoaded);
		this.removeEventListener('d2l-quick-eval-search-results-summary-container-clear-search', this._clearSearchResults);
		this.removeEventListener('d2l-hm-search-error', this._searchError);
		this.removeEventListener('d2l-quick-eval-activities-list-activities-shown-number-updated', this._updateNumberOfActivitiesToShow);
	}

	_getSearchAction(entity) {
		return this._getAction(entity, 'search');
	}

	_getAction(entity, name) {
		if (entity && entity.hasActionByName && entity.hasActionByName(name)) {
			return entity.getActionByName(name);
		}
		return null;
	}

	_updateNumberOfActivitiesToShow(e) {
		if (e && e.detail) {
			this.set('_numberOfActivitiesToShow', e.detail.count);
		}
	}

	_getFilterHref(entity) {
		return this._getHref(entity, Rels.filters);
	}

	_getHref(entity, rel) {
		if (entity && entity.hasLinkByRel && entity.hasLinkByRel(rel)) {
			return entity.getLinkByRel(rel).href;
		}
		return '';
	}

	_getFilterIds(masterTeacher) {
		// [ 'activity-name', 'enrollments', 'completion-date' ]
		let filters = [ 'c806bbc6-cfb3-4b6b-ae74-d5e4e319183d', 'f2b32f03-556a-4368-945a-2614b9f41f76', '05de346e-c94d-4e4b-b887-9c86c9a80351' ];
		if (masterTeacher) {
			filters = filters.concat('35b3aca0-c10c-436d-b369-c8a3022455e3'); // [ 'primary-facilitator' ]
		}
		return filters;
	}

	_searchResultsMessageEnabled() {
		return this._showSearchResultSummary && this.searchEnabled;
	}

	_filtersLoaded(e) {
		const list = this.shadowRoot.querySelector('d2l-quick-eval-activities-list');
		list.criteriaApplied = e.detail.totalSelectedFilters > 0;
		this._showFilterError = false;
	}

	_filtersUpdating() {
		const list = this.shadowRoot.querySelector('d2l-quick-eval-activities-list');
		list.setLoadingState(true);
		this._clearErrors();
	}

	_filtersChanged(e) {
		const list = this.shadowRoot.querySelector('d2l-quick-eval-activities-list');
		list.entity = e.detail.filteredActivities;
		this.entity = e.detail.filteredActivities;
		this._clearErrors();
	}

	_filterError() {
		const list = this.shadowRoot.querySelector('d2l-quick-eval-activities-list');
		list.setLoadingState(false);
		this._showFilterError = true;
	}

	_sortChanged(e) {
		this.entity = e.detail.sortedActivities;
	}

	_searchResultsLoading() {
		const list = this.shadowRoot.querySelector('d2l-quick-eval-activities-list');
		list.setLoadingState(true);
		this._clearErrors();
	}

	_searchResultsLoaded(e) {
		const list = this.shadowRoot.querySelector('d2l-quick-eval-activities-list');
		list.entity = e.detail.results;
		this.entity = e.detail.results;
		this._showSearchResultSummary = !e.detail.searchIsCleared;
		this._searchResultsCount = this.entity.entities && this.entity.entities.length ? this.entity.entities.length : 0;
		this._clearErrors();
	}

	_clearSearchResults() {
		const search = this.shadowRoot.querySelector('d2l-hm-search');
		search.clearSearch();
	}

	_searchError() {
		const list = this.shadowRoot.querySelector('d2l-quick-eval-activities-list');
		list.setLoadingState(false);
		this._showSearchError = true;
	}

	_clearErrors() {
		this._showSearchError = false;
		this._showFilterError = false;
	}
}

window.customElements.define('d2l-quick-eval', D2LQuickEval);
