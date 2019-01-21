import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const ActivityListItemResponsiveConstantsImpl = (superClass) => class extends superClass {
	get _descriptionLineCount() {
		return 2;
	}
	get _responsiveConfigs() {
		return [
			{
				minWidth: 0,
				image: {
					width: 90,
					height: 54,
					marginRight: '0.9rem'
				},
				title: {
					fontSize: 0.8, //rem
					lineHeight: 1.2, //rem
					fontWeight: 700,
					margin: '0.4rem 0 0 0'
				},
				padding: '0.9rem 0',
				showDescription: false
			},
			{
				minWidth: 339,
				image: {
					width: 120,
					height: 72,
					marginRight: '1.2rem'
				},
				title: {
					fontSize: 0.8, //rem
					lineHeight: 1.2, //rem
					fontWeight: 700,
					margin: '0.4rem 0 0 0'
				},
				padding: '0.9rem 0',
				showDescription: false
			},
			{
				minWidth: 385,
				image: {
					width: 120,
					height: 72,
					marginRight: '1.2rem'
				},
				title: {
					fontSize: 0.8, //rem
					lineHeight: 1.2, //rem
					fontWeight: 700,
					margin: '0.4rem 0 0.3rem 0'
				},
				padding: '0.9rem 0',
				showDescription: true
			},
			{
				minWidth: 580,
				image: {
					width: 120,
					height: 72,
					marginRight: '1.2rem'
				},
				title: {
					fontSize: 0.95, //rem
					lineHeight: 1.5, //rem
					fontWeight: 400,
					margin: '0.2rem 0'
				},
				padding: '1.2rem 0',
				showDescription: true
			},
			{
				minWidth: 636,
				image: {
					width: 180,
					height: 102,
					marginRight: '1.2rem'
				},
				title: {
					fontSize: 0.95, //rem
					lineHeight: 1.5, //rem
					fontWeight: 400,
					margin: '0.2rem 0'
				},
				padding: '1.2rem 0',
				showDescription: true
			},
			{
				minWidth: 842,
				image: {
					width: 216,
					height: 120,
					marginRight: '1.2rem'
				},
				title: {
					fontSize: 0.95, //rem
					lineHeight: 1.5, //rem
					fontWeight: 400,
					margin: '0.2rem 0'
				},
				padding: '1.2rem 0',
				showDescription: true
			}
		];
	}

	_getResponsiveConfig(width) {
		let responsiveConfig  = this._responsiveConfigs[0];
		for (var nextConfig of this._responsiveConfigs) {
			if (nextConfig.minWidth > width) {
				break;
			}
			responsiveConfig = nextConfig;
		}

		return responsiveConfig;
	}
};

export const ActivityListItemResponsiveConstants = dedupingMixin(ActivityListItemResponsiveConstantsImpl);
