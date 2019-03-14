import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import {Rels} from 'd2l-hypermedia-constants';
import 'd2l-typography/d2l-typography-shared-styles.js';
import 'd2l-common/components/d2l-hm-filter/d2l-hm-filter.js';
import './d2l-evaluation-hub-activities-list.js';

/**
 * @customElement
 * @polymer
 */
class D2LEvaluationHub extends mixinBehaviors([D2L.PolymerBehaviors.Siren.EntityBehavior], PolymerElement) {
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
					clear: both;
					display: block;
					padding-top: 1rem;
				}
			</style>
			<div class="d2l-evaluation-hub-top-bar">
				<template is="dom-if" if="[[headerText]]">
					<h1>[[headerText]]</h1>
				</template>
				<d2l-hm-filter href="[[_filterHref]]" token="[[token]]" category-whitelist="[[_filterIds]]"></d2l-hm-filter>
			</div>
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
			_filterIds: {
				type: Array,
				computed: '_getFilterIds(masterTeacher)'
			},
		};
	}

	static get is() { return 'd2l-evaluation-hub'; }

	attached()  {
		this.addEventListener('d2l-hm-filter-filters-updated', this._filterChanged);
		this.addEventListener('d2l-evaluation-hub-activities-list-sort-updated', this._sortChanged);
	}

	detached() {
		this.removeEventListener('d2l-hm-filter-filters-updated', this._filterChanged);
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

	_getFilterIds(masterTeacher) {
		// [ 'activity-name', 'enrollments', 'completion-date' ]
		let filters = [ 'c806bbc6-cfb3-4b6b-ae74-d5e4e319183d', 'f2b32f03-556a-4368-945a-2614b9f41f76', '05de346e-c94d-4e4b-b887-9c86c9a80351' ];
		if (masterTeacher) {
			filters = filters.concat('35b3aca0-c10c-436d-b369-c8a3022455e3'); // [ 'primary-facilitator' ]
		}
		return filters;
	}

	_filterChanged(e) {
		const list = this.shadowRoot.querySelector('d2l-evaluation-hub-activities-list');
		list.entity = e.detail.filteredActivities;
		this.entity = e.detail.filteredActivities;
	}

	_sortChanged(e) {
		this.entity = e.detail.sortedActivities;
	}

}

window.customElements.define('d2l-evaluation-hub', D2LEvaluationHub);
