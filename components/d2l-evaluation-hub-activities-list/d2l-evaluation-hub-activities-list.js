import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import 'd2l-table/d2l-table.js';
import 'd2l-colors/d2l-colors.js';
import 'd2l-offscreen/d2l-offscreen.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import 'd2l-polymer-siren-behaviors/store/siren-action-behavior.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import {Rels} from 'd2l-hypermedia-constants';

/**
 * @customElement
 * @polymer
 */

class D2LEvaluationHubActivitiesList extends mixinBehaviors([D2L.PolymerBehaviors.Siren.EntityBehavior], PolymerElement) {
	static get template() {
		return html`
			<style include="d2l-table-style">
				d2l-tr:hover {
					background: var(--d2l-color-gypsum, #E6EAF0);
					cursor: pointer;
				}
			</style>
			<d2l-table>
				<d2l-thead>
					<d2l-tr>
						<dom-repeat items="[[_headers]]">
							<template>
								<d2l-th on-click=sort>{{item.displayName}}</d2l-th>
							</template>
						</dom-repeat>
					</d2l-tr>
				</d2l-thead>
				<d2l-tbody>
					<dom-repeat items="[[_data]]" as="s">
						<template>
							<d2l-tr on-click="selectActivity">
								<dom-repeat items="[[_headers]]" as="h">
									<template>
										<d2l-td>[[getProperty(s, h.key)]]</d2l-td>
									</template>
								</dom-repeat>
							</d2l-tr>
						</template>
					</dom-repeat>
				</d2l-tbody>
			</d2l-table>
			<d2l-offscreen>
				<button onclick="[[loadMore]]">Load more</button>
			</d2l-offscreen>
		`;
	}
	static get is() { return 'd2l-evaluation-hub-activities-list'; }
	static get properties() {
		return {
			_headers: {
				type: String,
				value: [
					{ key: [ 'displayName' ], sortKey: 'displayName', displayName: 'Submitter'},
					{ key: [ 'activityName' ], sortKey: 'activityName', displayName: 'Activity Name'},
					{ key: [ 'courseName' ], sortKey: 'courseName', displayName: 'Course Name'},
					{ key: [ 'submissionDate' ], sortKey: 'submissionDate', displayName: 'Submission Date'}
				]
			},
			_data: {
				type: Array,
				value: [ ]
			},
			_loading: {
				type: Boolean,
				value: true
			},
			_filterHref: {
				type: String,
				value: ''
			},
			_sortHref: {
				type: String,
				value: ''
			},
			_pageNextHref: {
				type: String,
				value: ''
			}
		};
	}
	static get observers() {
		return [
			'loadData(entity, href)'
		];
	}
	ready() {
		super.ready();
		var self = this;
		this.addEventListener('d2l-siren-entity-error', function() {
			self._loading = false;
		});
	}
	constructor() { super(); }

	fetch(url) {
		return window.D2L.Siren.EntityStore.fetch(url, this.token);
	}

	loadMore() {
		// TODO: once paging is enabled!!!
	}

	sort(/*e*/) {
		// TODO: once sorting is enabled!!!
		// var sortKey = e.model.item.sortKey;
	}

	selectActivity(/*e*/) {
		// TODO: uncomment once activity link is being constructed properly.
		// window.location.href = e.model.s.activityLink;
		// console.log(e.model.s.activityLink);
	}

	loadData(entity) {
		if (!entity) {
			return Promise.resolve();
		}

		this._loading = true;
		var self = this;

		return Promise.resolve(entity)
			.then(function(data) {
				return self.followLink(data, Rels.whoami) || data;
			})
			.then(function(me) {
				return self.followLink(me.entity, Rels.Activities.myUnassessedActivities) || me;
			})
			.then(function(act) {
				return self.parseActivities(act.entity);
			}.bind(this))
			.catch(function() {
			}.bind(this))
			.then(function() {
				this._loading = false;
			}.bind(this));
	}

	followLink(entity, rel) {
		if (entity && entity.hasLinkByRel && entity.hasLinkByRel(rel)) {
			return this.fetch(entity.getLinkByRel(rel).href);
		}
	}

	async parseActivities(entity) {
		var self = this;
		var promises = [];
		entity.entities.forEach(function(activity) {
			promises.push(new Promise(function(resolve) {
				var item = {
					displayName: '',
					courseName: '',
					activityName: '',
					submissionDate: self.getSubmissionDate(activity),
					activityLink: self.getActivityLink(activity)
				};

				var getUserName = self.getUserPromise(activity, item);
				var getCourseName = self.getCoursePromise(activity, item);
				var getActivityName = self.getActivityPromise(activity, item);

				Promise.all([getUserName, getCourseName, getActivityName]).then(function() {
					resolve(item);
				});
			}));
		});

		self._filterHref = self.getHref(entity, Rels.filters);
		//self._sortHref = self.getHref(entity, Rels.sort);
		//self._pageNextHref = self.getHref(entity, Rels.pageNext);

		const result = await Promise.all(promises);
		self._data = self._data.concat(result);
	}

	getHref(entity, rel) {
		if (entity.hasLinkByRel(rel)) {
			return entity.getLinkByRel(rel).href;
		}
		return '';
	}

	getActivityLink(/*entity*/) {
		// TODO: get this link from api once enabled!!!
		return 'link to activity';
	}

	getActivityPromise(entity, item) {
		return this.followLink(entity, Rels.assignment)
			.then(function(a) {
				if (a) {
					item.activityName = a.entity.properties.name;
				}
			});
	}

	getCoursePromise(entity, item) {
		return this.followLink(entity, Rels.organization)
			.then(function(o) {
				if (o) {
					item.courseName = o.entity.properties.name;
				}
			});
	}

	getUserPromise(entity, item) {
		return this.followLink(entity, Rels.user)
			.then(function(u) {
				if (u && u.entity.hasSubEntityByRel(Rels.displayName)) {
					item.displayName = u.entity.getSubEntityByRel(Rels.displayName).properties.name;
				}
			});
	}

	getSubmissionDate(entity) {
		if (entity.hasSubEntityByRel('item')) {
			var i = entity.getSubEntityByRel('item');
			if (i.hasSubEntityByRel(Rels.date)) {
				return i.getSubEntityByRel(Rels.date).properties.date;
			}
		}
		return '';
	}

	getProperty(item, prop) {
		var result;
		if (Array.isArray(prop) && prop.length > 0) {
			result = item;
			for (var i = 0; i < prop.length; i++) {
				result = result[prop[i]];
			}
		} else {
			result = item[prop];
		}
		return result;
	}
}

window.customElements.define(D2LEvaluationHubActivitiesList.is, D2LEvaluationHubActivitiesList);
