import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {EvaluationHubLocalize} from './EvaluationHubLocalize.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import {Rels} from 'd2l-hypermedia-constants';
import 'd2l-typography/d2l-typography-shared-styles.js';
import 'd2l-alert/d2l-alert.js';
import 'd2l-common/components/d2l-hm-filter/d2l-hm-filter.js';
import './d2l-evaluation-hub-activities-list.js';

/**
 * @customElement
 * @polymer
 */
class D2LEvaluationHub extends mixinBehaviors([D2L.PolymerBehaviors.Siren.EntityBehavior], EvaluationHubLocalize(PolymerElement)) {
	static get template() {
		return html`
			<style>
				:host {
					display: block;
				}
				h1 {
					@apply --d2l-heading-1;
					float: left;
					margin: 0;
				}
				:host(:dir(rtl)) h1 {
					float: right;
				}
				d2l-hm-filter {
					float: right;
					padding: 0 2rem;
				}
				:host(:dir(rtl)) d2l-hm-filter {
					float: left;
				}
				.d2l-evaluation-hub-top-bar {
					padding-top: 0.25rem;
				}
				d2l-evaluation-hub-activities-list {
					display: block;
					padding-top: 1rem;
				}
				.clear {
					clear: both;
				}
				d2l-alert {
					margin: auto;
					margin-bottom: 0.5rem;
				}
			</style>
			<div class="d2l-evaluation-hub-top-bar">
				<template is="dom-if" if="[[headerText]]">
					<h1>[[headerText]]</h1>
				</template>
				<d2l-hm-filter href="[[_filterHref]]" token="[[token]]" category-whitelist="[[_filterClasses]]"></d2l-hm-filter>
			</div>
			<div class="clear"></div>
			<d2l-alert type="critical" hidden$="[[!_showFilterError]]">
				[[localize('failedToFilter')]]
			</d2l-alert>
			<d2l-evaluation-hub-activities-list href="[[href]]" token="[[token]]" master-teacher="[[masterTeacher]]"></d2l-evaluation-hub-activities-list>
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
			_filterHref: {
				type: String,
				computed: '_getFilterHref(entity)'
			},
			_filterClasses: {
				type: Array,
				computed: '_getFilterClasses(masterTeacher)'
			},
			_showFilterError: {
				type: Boolean,
				value: false
			}
		};
	}

	static get is() { return 'd2l-evaluation-hub'; }

	attached()  {
		this.addEventListener('d2l-hm-filter-filters-loaded', this._filtersLoaded);
		this.addEventListener('d2l-hm-filter-filters-updated', this._filtersChanged);
		this.addEventListener('d2l-hm-filter-error', this._filterError);
		this.addEventListener('d2l-evaluation-hub-activities-list-sort-updated', this._sortChanged);
	}

	detached() {
		this.removeEventListener('d2l-hm-filter-filters-loaded', this._filtersLoaded);
		this.removeEventListener('d2l-hm-filter-filters-updated', this._filtersChanged);
		this.removeEventListener('d2l-hm-filter-error', this._filterError);
		this.removeEventListener('d2l-evaluation-hub-activities-list-sort-updated', this._sortChanged);
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

	_getFilterClasses(masterTeacher) {
		let filters = [ 'activity-name', 'enrollments', 'completion-date' ];
		if (masterTeacher) {
			filters = filters.concat('primary-facilitator');
		}
		return filters;
	}

	_filtersLoaded(e) {
		const list = this.shadowRoot.querySelector('d2l-evaluation-hub-activities-list');
		list.criteriaApplied = e.detail.totalSelectedFilters > 0;
		this._showFilterError = false;
	}

	_filtersChanged(e) {
		const list = this.shadowRoot.querySelector('d2l-evaluation-hub-activities-list');
		list.entity = e.detail.filteredActivities;
		this.entity = e.detail.filteredActivities;
		this._showFilterError = false;
	}

	_filterError() {
		this._showFilterError = true;
	}

	_sortChanged(e) {
		this.entity = e.detail.sortedActivities;
	}

}

window.customElements.define('d2l-evaluation-hub', D2LEvaluationHub);
