import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import 'd2l-table/d2l-table.js';
import 'd2l-link/d2l-link.js';
import 'd2l-icons/tier1-icons.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import {Rels, Classes} from 'd2l-hypermedia-constants';

/**
 * @customElement
 * @polymer
 */

class D2LActivityNameIcon extends mixinBehaviors([D2L.PolymerBehaviors.Siren.EntityBehavior], PolymerElement) {
	static get template() {
		return html`
			<style>
				:host {
					font-weight: normal;
				}
			</style>
			<d2l-icon icon="d2l-tier1:assignments"></d2l-icon>
			<span>Josh's Assignment</span>
		`;
	}
	static get is() { return 'd2l-activity-name-icon'; }
	static get properties() {
		return {
			_testJosh: {
				type: String,
				value: 'jr17'
			}
		};
	}
	static get observers() {
		return [
			'_loadData(entity, href)'
		];
	}
	ready() {
		super.ready();
	}
	constructor() { super(); }

	_fetch(url) {
		return window.D2L.Siren.EntityStore.fetch(url, this.token);
	}

	async _loadData(entity) {
		if (!entity) {
			return Promise.resolve();
		}

		this._loading = true;

		try {
			await this._parseActivities(entity);
		} catch (e) {
			// Unable to load activities from entity.
		} finally {
			this._initialLoading = false;
			this._loading = false;
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
			return this._fetch(href);
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
					activityLink: this._getHref(activity, Rels.Assessments.assessmentApplication)
				};

				var getActivityName = this._getActivityPromise(activity, item);

				Promise.all([getActivityName]).then(function() {
					resolve(item);
				});
			}.bind(this)));
		}.bind(this));

		const result = await Promise.all(promises);
		this._data = this._data.concat(result);
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
}

window.customElements.define(D2LActivityNameIcon.is, D2LActivityNameIcon);
