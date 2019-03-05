import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {EvaluationHubLocalize} from './EvaluationHubLocalize.js';
import 'd2l-table/d2l-table.js';
import 'd2l-button/d2l-button.js';
import 'd2l-loading-spinner/d2l-loading-spinner.js';
import 'd2l-offscreen/d2l-offscreen.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import 'd2l-polymer-siren-behaviors/store/siren-action-behavior.js';
import 'd2l-polymer-behaviors/d2l-dom-focus.js';
import 'd2l-link/d2l-link.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import {Rels, Classes} from 'd2l-hypermedia-constants';
/**
 * @customElement
 * @polymer
 */

class D2LEvaluationHubActivitiesList extends mixinBehaviors([D2L.PolymerBehaviors.Siren.EntityBehavior, D2L.PolymerBehaviors.Siren.SirenActionBehavior ], EvaluationHubLocalize(PolymerElement)) {
	static get template() {
		return html`
			<style include="d2l-table-style">
				d2l-th {
					font-weight: bold;
				}
				d2l-td {
					font-weight: normal;
				}
				d2l-loading-spinner {
					width: 100%;
				}
				.d2l-evaluation-hub-activities-list-load-more-container {
					padding-top: 1rem;
					text-align: right;
					width: 100%;
				}
				[hidden] {
					display: none;
				}
			</style>
			<d2l-table hidden$="[[_fullListLoading]]" aria-colcount$="[[_headers.length]]" aria-rowcount$="[[_data.length]]">
				<d2l-thead>
					<d2l-tr>
						<dom-repeat items="[[_headers]]">
							<template>
								<template is="dom-if" if="[[_shouldDisplayColumn(item.key)]]">
									<d2l-th><d2l-table-col-sort-button nosort on-click="_sort" id="[[item.sortKey]]"><span>[[localize(item.localizationKey)]]</span></d2l-table-col-sort-button></d2l-th>
								</template>
							</template>
						</dom-repeat>
					</d2l-tr>
				</d2l-thead>
				<d2l-tbody>
					<dom-repeat items="[[_data]]" as="s">
						<template>
							<d2l-tr>
								<dom-repeat items="[[_headers]]" as="h">
									<template>
										<template is="dom-if" if="[[_shouldDisplayColumn(h.key)]]">
											<d2l-td>
												<d2l-link href="[[s.activityLink]]" hidden$="[[!h.canLink]]">[[_getDataProperty(s, h.key)]]</d2l-link>
												<span hidden$="[[h.canLink]]">[[_getDataProperty(s, h.key)]]</span>
											</d2l-td>
										</template>
									</template>
								</dom-repeat>
							</d2l-tr>
						</template>
					</dom-repeat>
				</d2l-tbody>
			</d2l-table>
			<d2l-offscreen role="alert" aria-live="aggressive" hidden$="[[!_loading]]">[[localize('loading')]]</d2l-offscreen>
			<d2l-loading-spinner size="80" hidden$="[[!_loading]]"></d2l-loading-spinner>
			<template is="dom-if" if="[[_pageNextHref]]">
				<div class="d2l-evaluation-hub-activities-list-load-more-container">
					<d2l-button class="d2l-evaluation-hub-activities-list-load-more" onclick="[[_loadMore]]">[[localize('loadMore')]]</d2l-button>
				</div>
			</template>
		`;
	}
	static get is() { return 'd2l-evaluation-hub-activities-list'; }
	static get properties() {
		return {
			'masterTeacher': {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			},
			_headers: {
				type: Array,
				value: [
					{ key: 'displayName', sortKey: 'displayName', sortClass: 'displayName', canSort: false, localizationKey: 'displayName', canLink: true },
					{ key: 'activityName', sortKey: 'activityName', sortClass: 'activityName', canSort: false, localizationKey: 'activityName', canLink: false },
					{ key: 'courseName', sortKey: 'courseName', sortClass: 'courseName', canSort: false, localizationKey: 'courseName', canLink: false },
					{ key: 'submissionDate', sortKey: 'submissionDate', sortClass: 'submissionDate', canSort: false, localizationKey: 'submissionDate', canLink: false },
					{ key: 'masterTeacher', sortKey: 'masterTeacher', sortClass: 'masterTeacher', canSort: false, localizationKey: 'masterTeacher', canLink: false }
				]
			},
			_data: {
				type: Array,
				value: [ ]
			},
			_fullListLoading: {
				type: Boolean,
				value: true
			},
			_loading: {
				type: Boolean,
				value: true
			},
			_filterHref: {
				type: String,
				value: ''
			},
			_pageNextHref: {
				type: String,
				value: ''
			},
			_currentEntity: {
				type: Object,
				value: {}
			}
		};
	}
	static get observers() {
		return [
			'_loadData(entity)'
		];
	}
	ready() {
		super.ready();
		this.addEventListener('d2l-siren-entity-error', function() {
			this._fullListLoading = false;
			this._loading = false;
		}.bind(this));
		this._loadMore = this._loadMore.bind(this);
	}
	constructor() { super(); }

	_myEntityStoreFetch(url) {
		return window.D2L.Siren.EntityStore.fetch(url, this.token);
	}

	_loadSorts(entity) {
		return this._followLink(entity, Rels.sorts)
			.then(sortsEntity => {
				if (!sortsEntity || !sortsEntity.entity) {
					return Promise.reject('Could not load sorts endpoint');
				}

				this._headers.forEach(header => {
					const sort = sortsEntity.entity.getSubEntityByClass(header.sortClass);
					if (sort) {
						header.canSort = true;
					}
				});
				return Promise.resolve();
			});
	}

	_sort(e) {
		const header = this._headers.find(h => h.sortKey === e.currentTarget.id);

		if (!header) {
			return Promise.reject(`No matching header for ${e.currentTarget.id}`);
		}
		if (!header.canSort) {
			return Promise.reject(`No matching sort for ${e.currentTarget.id}`);
		}

		let ascending = true;

		if (e.currentTarget.nosort) {
			e.currentTarget.removeAttribute('nosort');
		} else if (e.currentTarget.desc) {
			e.currentTarget.removeAttribute('desc');
		} else {
			ascending = false;
			e.currentTarget.setAttribute('desc', 'desc');
		}

		const headers = this.shadowRoot.querySelectorAll('d2l-table-col-sort-button');
		headers.forEach(h => {
			if (h !== e.currentTarget) {
				h.removeAttribute('desc');
				h.setAttribute('nosort', 'nosort');
			}
		});

		return this._followLink(this._currentEntity, Rels.sorts)
			.then((sortsEntity => {
				if (!sortsEntity || !sortsEntity.entity) {
					return Promise.reject('Could not load sorts endpoint');
				}

				const sort = sortsEntity.entity.getSubEntityByClass(header.sortClass);
				if (!sort) {
					return Promise.reject(`Could not find sort class ${header.sortClass}`)
				}

				const actionName = ascending ? 'sort-ascending' : 'sort-descending';
				const action = sort.getActionByName(actionName);
				if (!action) {
					return Promise.reject(`Could not find sort action ${actionName} for sort ${sort}`);
				}

				return this.performSirenAction(action);
			}).bind(this))
			.then((sortsEntity => {
				if (!sortsEntity) {
					return Promise.reject('Could not load sorts endpoint after sort is applied');
				}
				const action = sortsEntity.getActionByName('apply');
				if (!action) {
					return Promise.reject(`Could not find apply action in ${sortsEntity}`);
				}
				return action;
			}).bind(this))
			.then((collectionAction => {
				const collection = this.performSirenAction(collectionAction);
				return collection;
			}).bind(this))
			.then((collection => {
				this.entity = collection;
			}).bind(this));
	}

	async _loadData(entity) {
		if (!entity) {
			return Promise.resolve();
		}

		this._loading = true;
		this._fullListLoading = true;

		try {
			var result = await this._parseActivities(entity);
			this._data = result;
			return this._loadSorts(entity);
		} catch (e) {
			// Unable to load activities from entity.
			return Promise.reject(e);
		} finally {
			this._fullListLoading = false;
			this._loading = false;
		}
	}

	_loadMore() {
		if (this._pageNextHref && !this._loading) {
			this._loading = true;
			this._followHref(this._pageNextHref).then(async function(u) {
				if (u && u.entity) {
					var tbody = this.shadowRoot.querySelector('d2l-tbody');
					var lastFocusableTableElement = D2L.Dom.Focus.getLastFocusableDescendant(tbody, false);

					try {
						var result = await this._parseActivities(u.entity);
						this._data = this._data.concat(result);
					} catch (e) {
						// Unable to load more activities from entity.
					} finally {
						this._loading = false;
						window.requestAnimationFrame(function() {
							var newElementToFocus = D2L.Dom.Focus.getNextFocusable(lastFocusableTableElement, false);
							newElementToFocus.focus();
						});
					}
				}
			}.bind(this));
		}
	}

	_followLink(entity, rel) {
		var href = this._getHref(entity, rel);
		return this._followHref(href);
	}

	_getHref(entity, rel) {
		if (entity && entity.hasLinkByRel && entity.hasLinkByRel(rel)) {
			return entity.getLinkByRel(rel).href;
		}
		return '';
	}

	_followHref(href) {
		if (href) {
			return this._myEntityStoreFetch(href);
		}
		return Promise.resolve();
	}

	async _parseActivities(entity) {
		var promises = [];
		entity.entities.forEach(function(activity) {
			promises.push(new Promise(function(resolve) {
				var item = {
					displayName: '',
					courseName: '',
					activityName: '',
					submissionDate: this._getSubmissionDate(activity),
					activityLink: this._getRelativeUriProperty(activity),
					masterTeacher: ''
				};

				var getUserName = this._getUserPromise(activity, item);
				var getCourseName = this._getCoursePromise(activity, item);
				var getActivityName = this._getActivityPromise(activity, item);
				var getMasterTeacherName =
					this._shouldDisplayColumn('masterTeacher')
						? this._getMasterTeacherPromise(activity, item)
						: Promise.resolve();

				Promise.all([getUserName, getCourseName, getActivityName, getMasterTeacherName]).then(function() {
					resolve(item);
				});
			}.bind(this)));
		}.bind(this));

		this._filterHref = this._getHref(entity, Rels.filters);
		this._pageNextHref = this._getHref(entity, 'next');
		this._currentEntity = entity;

		const result = await Promise.all(promises);
		return result;
	}

	_getMasterTeacherPromise(entity, item) {
		return this._followLink(entity, Rels.organization)
			.then(function(org) {
				if (org && org.entity) {
					return this._followLink(org.entity, Rels.enrollments);
				}
			}.bind(this))
			.then(function(enrollment) {
				if (enrollment && enrollment.entity) {
					return this._followLink(enrollment.entity, Rels.filters);
				}
			}.bind(this))
			.then(function(filters) {
				if (filters && filters.entity && filters.entity.hasSubEntityByClass('role-markers')) {
					var roleMarkerFilter = filters.entity.getSubEntityByClass('role-markers');
					if (roleMarkerFilter.href) {
						return this._followHref(roleMarkerFilter.href);
					}
				}
			}.bind(this))
			.then(function(filterOptions) {
				if (filterOptions && filterOptions.entity) {
					var action = filterOptions.entity.getActionByName('search');
					if (action) {
						var fields = [
							{
								name: 'search',
								value: 'Primary Facilitator'
							}
						];

						return this.performSirenAction(action, fields);
					}
				}
			}.bind(this))
			.then(function(filterOptions) {
				if (filterOptions) {
					var masterTeacherOption = filterOptions.getSubEntityByRel('https://api.brightspace.com/rels/filter');
					var action = masterTeacherOption.getActionByName('add-filter');
					return this.performSirenAction(action);
				}
			}.bind(this))
			.then(function(filterOptions) {
				if (filterOptions) {
					var action = filterOptions.getActionByName('apply');
					return this.performSirenAction(action);
				}
			}.bind(this))
			.then(function(filters) {
				if (filters) {
					var action = filters.getActionByName('apply');
					return this.performSirenAction(action);
				}
			}.bind(this))
			.then(function(enrollment) {
				if (enrollment && enrollment.hasSubEntityByRel(Rels.userEnrollment)) {
					var userEnrollment = enrollment.getSubEntityByRel(Rels.userEnrollment);
					if (userEnrollment.href) {
						return this._followHref(userEnrollment.href);
					}
				}
			}.bind(this))
			.then(function(userEnrollment) {
				if (userEnrollment && userEnrollment.entity) {
					return this._followLink(userEnrollment.entity, Rels.user);
				}
			}.bind(this))
			.then(function(user) {
				if (user && user.entity && user.entity.hasSubEntityByRel(Rels.displayName)) {
					item.masterTeacher = user.entity.getSubEntityByRel(Rels.displayName).properties.name;
				}
			}.bind(this));
	}

	_getActivityPromise(entity, item) {
		var rel;
		if (entity.hasClass(Classes.activities.userQuizAttemptActivity)) {
			rel = Rels.quiz;
		} else if (entity.hasClass(Classes.activities.userAssignmentActivity)) {
			rel = Rels.assignment;
		} else if (entity.hasClass(Classes.activities.userDiscussionActivity)) {
			rel = Rels.Discussions.topic;
		} else {
			return Promise.resolve();
		}
		return this._followLink(entity, rel)
			.then(function(a) {
				if (a && a.entity && a.entity.properties) {
					item.activityName = a.entity.properties.name;
				}
			});
	}

	_getCoursePromise(entity, item) {
		return this._followLink(entity, Rels.organization)
			.then(function(o) {
				if (o && o.entity && o.entity.properties) {
					item.courseName = o.entity.properties.name;
				}
			});
	}

	_getUserPromise(entity, item) {
		return this._followLink(entity, Rels.user)
			.then(function(u) {
				if (u && u.entity && u.entity.hasSubEntityByRel(Rels.displayName)) {
					item.displayName = u.entity.getSubEntityByRel(Rels.displayName).properties.name;
				}
			});
	}

	_getSubmissionDate(entity) {
		if (entity.hasSubEntityByClass(Classes.activities.completion)) {
			var i = entity.getSubEntityByClass(Classes.activities.completion);
			if (i.hasSubEntityByClass(Classes.dates.date)) {
				return i.getSubEntityByClass(Classes.dates.date).properties.date;
			}
		}
		return '';
	}

	_getRelativeUriProperty(entity) {
		if (entity.hasSubEntityByClass(Classes.relativeUri)) {
			var i = entity.getSubEntityByClass(Classes.relativeUri);
			return i.properties.path;
		}
		return '';
	}

	_getDataProperty(item, prop) {
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

	_shouldDisplayColumn(columnKey) {
		if (columnKey === 'masterTeacher') {
			return this.masterTeacher;
		}
		return true;
	}
}

window.customElements.define(D2LEvaluationHubActivitiesList.is, D2LEvaluationHubActivitiesList);
