import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import 'd2l-polymer-siren-behaviors/store/siren-action-behavior.js';

window.D2L = window.D2L || {};
window.D2L.PolymerBehaviors = window.D2L.PolymerBehaviors || {};
window.D2L.PolymerBehaviors.Siren = window.D2L.PolymerBehaviors.Siren || {};

/*
* Behavior for helping process siren actions
* @polymerBehavior
*/
D2L.PolymerBehaviors.Siren.D2LSirenHelperBehaviorImpl = {

	_myEntityStoreFetch : function(url) {
		return window.D2L.Siren.EntityStore.fetch(url, this.token);
	},

	_followLink: function(entity, rel) {
		const href = this._getHref(entity, rel);
		return this._followHref(href);
	},

	_getHref: function(entity, rel) {
		if (entity && entity.hasLinkByRel && entity.hasLinkByRel(rel)) {
			return entity.getLinkByRel(rel).href;
		}
		return '';
	},

	_followHref: function(href) {
		if (href) {
			return this._myEntityStoreFetch(href);
		}
		return Promise.resolve();
	},

	_performSirenActionWithQueryParams: function(action, customParams) {
		const url = new URL(action.href, window.location.origin);

		if (!action.fields) {
			action.fields = [];
		}

		url.searchParams.forEach(function(value, key) {
			if (!action.fields.filter(x => x.name === key)[0]) {
				action.fields.push({name: key, value: value, type: 'hidden'});
			}
		});

		if (customParams) {
			Object.keys(customParams).forEach(function(paramName) {
				action.fields.push({name: paramName, value: customParams[paramName], type: 'hidden'});
			});
		}

		return this.performSirenAction(action);
	},

	_getExtraParams: function(url) {
		if (!url || url === '') return [];

		const extraParams = [];

		const filterVal = this._getQueryStringParam('filter', url);
		if (filterVal) {
			extraParams.push(
				{
					name: 'filter',
					value: filterVal
				}
			);
		}
		const sortVal = this._getQueryStringParam('sort', url);
		if (sortVal) {
			extraParams.push(
				{
					name: 'sort',
					value: sortVal
				}
			);
		}

		return extraParams;
	},

	_getQueryStringParam: function(name, url) {
		const parsedUrl = new window.URL(url);
		return parsedUrl.searchParams.get(name);
	},

	_buildRelativeUri: function(url, extraParams) {
		if (extraParams.length === 0) {
			return url;
		}

		const parsedUrl = new window.URL(url, 'https://notused.com');

		extraParams.forEach(param => {
			parsedUrl.searchParams.set(param.name, param.value);
		});

		return parsedUrl.pathname + parsedUrl.search;
	}
};

/** @polymerBehavior */
D2L.PolymerBehaviors.Siren.D2LSirenHelperBehavior = [
	D2L.PolymerBehaviors.Siren.EntityBehavior,
	D2L.PolymerBehaviors.Siren.SirenActionBehavior,
	D2L.PolymerBehaviors.Siren.D2LSirenHelperBehaviorImpl
];
