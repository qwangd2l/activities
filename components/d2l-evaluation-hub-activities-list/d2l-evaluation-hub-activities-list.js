import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '../../../d2l-table/d2l-table.js';
import '../../../d2l-offscreen/d2l-offscreen.js';
import '../../../d2l-polymer-siren-behaviors/store/entity-behavior.js';
import '../../../d2l-polymer-siren-behaviors/store/siren-action-behavior.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';

/**
 * @customElement
 * @polymer
 */

class D2lEvaluationHubActivitiesList extends mixinBehaviors([D2L.PolymerBehaviors.Siren.EntityBehavior], PolymerElement) {
	static get template() {
		return html`
			<style include="d2l-table-style">
				d2l-tr:hover {
					background: #eaedf0;
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
				computed: 'getHeaders()'
			},
			_data: {
				type: Array,
				value: [ ]
			},
			_rels: {
				type: Object,
				computed: 'getRels()'
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
			},
			_test: {
				type: Object,
				value: { }
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
			self.set('_loading', false);
		});
	}
	constructor() { super(); }

	getHeaders() {
		return [
			{ key: [ 'displayName' ], sortKey: 'displayName', displayName: 'Submitter'},
			{ key: [ 'activityName' ], sortKey: 'activityName', displayName: 'Activity Name'},
			{ key: [ 'courseName' ], sortKey: 'courseName', displayName: 'Course Name'},
			{ key: [ 'submissionDate' ], sortKey: 'submissionDate', displayName: 'Submission Date'}
		];
	}

	getRels() {
		return {
			me: this.getRel('whoami'),
			activities: this.getRel('my-unassessed-activities', 'activities'),
			user: this.getRel('user'),
			org: this.getRel('organization'),
			assignment: this.getRel('assignment'),
			displayName: this.getRel('display-name'),
			firstName: this.getRel('first-name'),
			lastName: this.getRel('last-name'),
			date: this.getRel('date'),
			filter: this.getRel('filters'),
			sort: this.getRel(''),
			pageNext: this.getRel('')
		};
	}

	getRel(post, pre) {
		return `https://${pre ? pre + '.' : ''}api.brightspace.com/rels/${post}`;
	}

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
		this._test = entity;
		if (!entity) {
			return Promise.resolve();
		}

		var self = this;

		return Promise.resolve(entity)
			.then(function(data) {
				return self.followLink(data, self._rels.me);
			})
			.then(function(me) {
				return self.followLink(me.entity, self._rels.activities);
			})
			.then(function(act) {
				return self.parseActivities(act);
			}.bind(this))
			.catch(function() {

			}.bind(this))
			.then(function() {
				this.set('_loading', false);
			}.bind(this));
	}

	followLink(data, rel) {
		if (data.hasLinkByRel(rel)) {
			return this.fetch(data.getLinkByRel(rel).href);
		}
		return Promise.resolve(data);
	}

	parseActivities(act) {
		var self = this;
		var promises = [];
		act.entity.entities.forEach(function(activity) {
			promises.push(new Promise(function(resolve) {
				var item = {
					displayName: '',
					courseName: '',
					activityName: '',
					submissionDate: '',
					activityLink: ''
				};

				item.submissionDate = self.getSubmissionDate(activity);
				item.activityLink = self.getActivityLink(activity);

				var getUserName = self.getUserPromise(activity, item);
				var getCourseName = self.getCoursePromise(activity, item);
				var getActivityName = self.getActivityPromise(activity, item);

				Promise.all([getUserName, getCourseName, getActivityName]).then(function() {
					resolve(item);
				});
			}));
		});

		self._filterHref = self.getHref(act.entity, self._rels.filter);
		self._sortHref = self.getHref(act.entity, self._rels.sort);
		self._pageNextHref = self.getHref(act.entity, self._rels.pageNext);

		return Promise.all(promises).then(function(result) {
			self.set('_data', self._data.concat(result));
		});
	}

	getHref(entity, rel) {
		if (entity.hasLinkByRel(rel)) {
			return entity.getLinkByRel(rel).href;
		}
		return '';
	}

	getActivityLink(/*entity*/) {
		// TODO: figure out how to construct this link!!!
		return 'link to activity';
	}

	getActivityPromise(entity, item) {
		if (entity.hasLinkByRel(this._rels.assignment)) {
			var assignment = entity.getLinkByRel(this._rels.assignment);
			return this.fetch(assignment.href)
				.then(function(a) {
					item.activityName = a.entity.properties.name;
				});
		}
		return Promise.resolve();
	}

	getCoursePromise(entity, item) {
		if (entity.hasLinkByRel(this._rels.org)) {
			var org = entity.getLinkByRel(this._rels.org);
			return this.fetch(org.href)
				.then(function(o) {
					item.courseName = o.entity.properties.name;
				});
		}
		return Promise.resolve();
	}

	getUserPromise(entity, item) {
		if (entity.hasLinkByRel(this._rels.user)) {
			var user = entity.getLinkByRel(this._rels.user);
			var self = this;
			return this.fetch(user.href)
				.then(function(u) {
					if (u.entity.hasSubEntityByRel(self._rels.displayName)) {
						item.displayName = u.entity.getSubEntityByRel(self._rels.displayName).properties.name;
					}
				});
		}
		return Promise.resolve();
	}

	getSubmissionDate(entity) {
		if (entity.hasSubEntityByRel('item')) {
			var i = entity.getSubEntityByRel('item');
			if (i.hasSubEntityByRel(this._rels.date)) {
				return i.getSubEntityByRel(this._rels.date).properties.date;
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

window.customElements.define(D2lEvaluationHubActivitiesList.is, D2lEvaluationHubActivitiesList);
