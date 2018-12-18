import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import {MutableData} from '@polymer/polymer/lib/mixins/mutable-data.js';
import {beforeNextRender, afterNextRender} from '@polymer/polymer/lib/utils/render-status.js';
import {IronResizableBehavior} from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import 'fastdom/fastdom.min.js';
import 'd2l-offscreen/d2l-offscreen-shared-styles.js';
import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier1-icons.js';
import 'd2l-course-image/d2l-course-image.js';
import {Classes, Rels} from 'd2l-hypermedia-constants';
import 'd2l-fetch-siren-entity-behavior/d2l-fetch-siren-entity-behavior.js';
import 'd2l-organizations/components/d2l-organization-name/d2l-organization-name.js';
import 'd2l-typography/d2l-typography.js';
import 'd2l-polymer-behaviors/d2l-focusable-behavior.js';
import 'd2l-button/d2l-button.js';
import './d2l-activity-list-item-enroll.js';

/**
 * @customElement
 * @polymer
 */
class D2lActivityListItem extends mixinBehaviors([IronResizableBehavior, D2L.PolymerBehaviors.FetchSirenEntityBehavior, D2L.PolymerBehaviors.FocusableBehavior], MutableData(PolymerElement)) {
	static get template() {
		return html`
			<style include="d2l-typography"></style>
			<style include="d2l-offscreen-shared-styles">
				:host {
					display: block;
				}
				:host([active]) {
					border-color: rgba(0, 111, 191, 0.4);
					box-shadow: 0 0 0 4px rgba(0, 111, 191, 0.3);
				}
				.d2l-activity-list-item-container:hover,
				.d2l-activity-list-item-container:focus {
					background-color: #FAFBFC; /* Pending Colin */
				}
				.d2l-activity-list-item-container {
					position: relative;
					height: 100%;
				}
				.d2l-activity-list-item-link-container {
					overflow: hidden;
					display: flex;
					flex-direction: row;
					flex-grow: 1;
					flex-shrink: 1;
					flex-basis: 0;
				}
				.d2l-activity-list-item-link-text {
					display: inline-block;
					@apply --d2l-offscreen;
				}
				a.d2l-focusable {
					display: block;
					position: absolute;
					height: 100%;
					outline: none;
					width: 100%;
					z-index: 1;
				}
				/* P2-shadow */
				:host-context([dir="rtl"]) .d2l-activity-list-item-link-text {
					@apply --d2l-offscreen-rtl
				}
				/* P1-shady, P2-shady */
				:host(:dir(rtl)) .d2l-activity-list-item-link-text {
					@apply --d2l-offscreen-rtl
				}
				.d2l-activity-list-item-image {
					flex-shrink: 0;
					margin: 0.5rem;
					width: 273px;
					height: 161px;
					display: flex;
					align-items: center;
					justify-content: center;
					overflow: hidden;
				}
				.d2l-activity-list-item-title {
					flex-shrink: 0;
					@apply --d2l-heading-3;
					color: var(--d2l-color-ferrite);
				}
				.d2l-activity-list-item-description p {
					margin: 0;
					padding: 0;
					@apply --d2l-body-compact-text;
					color: var(--d2l-color-ferrite);
				}
				.d2l-activity-list-item-footer,
				.d2l-activity-list-item-footer span d2l-icon {
					flex-shrink: 0;
					color: var(--d2l-color-tungsten);
					@apply --d2l-body-small-text;
				}
				.d2l-activity-list-item-footer {
					height: 1rem;
					overflow: hidden;
				}
				.d2l-activity-list-item-footer span d2l-icon {
					--d2l-icon-width: 18px;
					--d2l-icon-height: 18px;
				}
				.d2l-activity-list-item-footer span:first-child d2l-icon{
					display: none;
				}
				.d2l-activity-list-item-footer span {
					white-space: nowrap;
				}
				.d2l-activity-list-item-content {
					flex-grow: 1;
					margin: 0.5rem 0 0 0;
					display: flex;
					flex-direction: column;
					width: 100%;
				}
				.d2l-activity-list-item-content > * {
					margin: 0.5rem 0.5rem 0 0.5rem;
				}
				:host d2l-activity-list-item-enroll {
					margin: 0.5rem 1rem;
				}
			</style>
			<div class="d2l-activity-list-item-container">
				<a class="d2l-focusable" href$="[[_link]]">
					<span class="d2l-activity-list-item-link-text">[[_accessibilityDataToString(_accessibilityData)]]</span>
				</a>
				<div class="d2l-activity-list-item-link-container">
					<div class="d2l-activity-list-item-image">
						<d2l-course-image
							image="[[_image]]"
							sizes="[[_tileSizes]]"
							type="narrow">
						</d2l-course-image>
					</div>
					<div class="d2l-activity-list-item-content">
						<div class="d2l-activity-list-item-title">
							<d2l-organization-name href="[[_organizationUrl]]"></d2l-organization-name>
						</div>
						<div class="d2l-activity-list-item-description" hidden$="[[!_descriptionMaxLines]]"><p>[[_description]]</p></div>
						<div class="d2l-activity-list-item-footer" hidden$="[[!_tags]]">
							<template is="dom-repeat" items="[[_tags]]">
								<span>
									<d2l-icon icon="d2l-tier1:bullet"></d2l-icon>
									[[item]]
								</span>
							</template>
						</div>
					</div>
				</div>
			</div>
			<d2l-activity-list-item-enroll action-enroll="[[_actionEnroll]]"></d2l-activity-list-item-enroll>
		`;
	}

	static get properties() {
		return {
			href: {
				type: String,
				observer: '_onHrefChange'
			},
			entity: {
				type: Object,
				value: function() {
					return {};
				},
				observer: '_onSirenEntityChange'
			},
			_imageUrl: String,
			_title: String,
			_description: {
				type: String,
				observer: '_onDescriptionChange'
			},
			_organizationUrl: String,
			_tags: String,
			_descriptionMaxLines: Number,
			_responsiveMinWidth: Number,
			_image: Object,
			_imageLoading: {
				type: Boolean,
				value: false
			},
			_imageLoadingProgress: {
				type: Boolean,
				value: false
			},
			_tileSizes: {
				type: Object,
				value: function() {
					return {
						mobile: {
							maxwidth: 767,
							size: 100
						},
						tablet: {
							maxwidth: 1243,
							size: 67
						},
						desktop: {
							size: 25
						}
					};
				}
			},
			actionEnroll: {
				type: String,
				value: ''
			},
			_link: String,
			_accessibilityData: {
				type: Object,
				value: function() { return {}; }
			}
		};
	}

	ready() {
		super.ready();
		this._onLinkBlur = this._onLinkBlur.bind(this);
		this._onLinkFocus = this._onLinkFocus.bind(this);
		this._onIronSize = () => this._setResponsiveSizes(this.offsetWidth);
		this.addEventListener('d2l-organization-accessible', this._onD2lOrganizationAccessible);
	}
	attached() {
		super.attached();
		afterNextRender(this, () => {
			const link = this.shadowRoot.querySelector('a');
			link.addEventListener('blur', this._onLinkBlur);
			link.addEventListener('focus', this._onLinkFocus);
			this.addEventListener('iron-resize', this._onIronSize);
			this._setResponsiveSizes(this.offsetWidth);
		});
	}
	_onD2lOrganizationAccessible(e) {
		if (e.detail.organization) {
			if (e.detail.organization.name) {
				this._accessibilityData.organizationName = e.detail.organization.name;
			}
		}
		if (e.detail.semesterName) {
			this._accessibilityData.semesterName = e.detail.semesterName;
		}

		this.notifyPath('_accessibilityData');
	}

	_accessibilityDataToString(accessibility) {
		if (!accessibility) {
			return;
		}

		const textData = [
			accessibility.organizationName
		];
		return textData.filter(function(text) {
			return text && typeof text === 'string';
		}).join(', ');
	}
	detached() {
		const link = this.shadowRoot.querySelector('a');
		link.removeEventListener('blur', this._onLinkBlur);
		link.removeEventListener('focus', this._onLinkFocus);
		this.removeEventListener('iron-resize', this._onIronSize);
	}
	get _responsiveSizes() {
		return [
			{
				minWidth: 0,
				imageSize: {
					width: 89,
					height: 50
				},
				descriptionMaxLines: 0
			},
			{
				minWidth: 400,
				imageSize: {
					width: 135,
					height: 75
				},
				descriptionMaxLines: 0
			},
			{
				minWidth: 500,
				imageSize: {
					width: 183,
					height: 102
				},
				descriptionMaxLines: 2
			},
			{
				minWidth: 600,
				imageSize: {
					width: 212,
					height: 125
				},
				descriptionMaxLines: 2
			},
			{
				minWidth: 700,
				imageSize: {
					width: 273,
					height: 161
				},
				descriptionMaxLines: 3
			},
			{
				minWidth: 900,
				imageSize: {
					width: 273,
					height: 161
				},
				descriptionMaxLines: 4
			}
		];
	}

	_reset() {
		Object.keys(D2lActivityListItem.properties).forEach((key) => {
			this.set(key, D2lActivityListItem.properties[key].default);
		});
	}

	_onLinkBlur() {
		window.fastdom.mutate(function() {
			this.removeAttribute('active', 'active');
		}.bind(this));
	}

	_onLinkFocus() {
		window.fastdom.mutate(function() {
			this.setAttribute('active', 'active');
		}.bind(this));
	}

	_setResponsiveSizes(currentWidth) {
		let currentSize = this._responsiveSizes[0];
		for (var nextSize of this._responsiveSizes) {
			if (nextSize.minWidth > currentWidth) {
				break;
			}
			currentSize = nextSize;
		}

		if (this._responsiveMinWidth === currentSize.minWidth) {
			return;
		}

		this._descriptionMaxLines = currentSize.descriptionMaxLines;
		this._responsiveMinWidth = currentSize.minWidth;

		window.fastdom.mutate(() => {
			const image = this.shadowRoot.querySelector('.d2l-activity-list-item-image');
			image.style.width = currentSize.imageSize.width + 'px';
			image.style.height = currentSize.imageSize.height + 'px';
		});

		this._clampDescription(this._description);
	}
	_onDescriptionChange(description) {
		this._clampDescription(description);
	}
	_clampDescription(description) {
		const p = this.shadowRoot.querySelector('.d2l-activity-list-item-description p');
		const height = window.getComputedStyle(p).getPropertyValue('line-height').match(/\d+/);
		const lineHeight = height && height[0];

		if (this._descriptionMaxLines === 0 || p.offsetHeight === this._descriptionMaxLines * lineHeight || !lineHeight) {
			return;
		}

		beforeNextRender(this, () => {
			window.fastdom.mutate(() => {
				p.textContent = description;
				while (p.offsetHeight > this._descriptionMaxLines * lineHeight || p.textContent === '...')  {
					p.textContent = p.textContent.replace(/\W*\s(\S)*$/, '...');
				}
			});
		});
	}
	_onHrefChange(href) {
		if (!href || (this.entity.hasLinkByRel && this.entity.hasLinkByRel('self') && this.entity.getLinkByRel('self').href !== href)) {
			return;
		}

		this._fetchEntity(href)
			.then((sirenEntity) => this.entity = sirenEntity);
	}
	_onSirenEntityChange(sirenEntity) {
		if (!sirenEntity ||
			!sirenEntity.hasAction ||
			!sirenEntity.hasLink
		) {
			return;
		}
		this._description = sirenEntity.properties && sirenEntity.properties.description;

		if (sirenEntity.hasAction('assign') && !sirenEntity.hasClass('enroll')) {
			this._actionEnroll = sirenEntity.getAction('assign').href;
		}

		this._organizationUrl = sirenEntity.hasLink(Rels.organization) && sirenEntity.getLinkByRel(Rels.organization).href;
		if (this._organizationUrl) {
			this._fetchEntity(this._organizationUrl)
				.then(this._handleOrganizationResponse.bind(this));
		}

		this.href = sirenEntity.hasLink('self') && sirenEntity.getLinkByRel('self').href;
	}

	_handleOrganizationResponse(organization) {
		this._organization = organization;

		if (organization.hasSubEntityByClass(Classes.courseImage.courseImage)) {
			var imageEntity = organization.getSubEntityByClass(Classes.courseImage.courseImage);
			if (imageEntity.href) {
				this._fetchEntity(imageEntity.href)
					.then(function(hydratedImageEntity) {
						this._image = hydratedImageEntity;
					}.bind(this));
			} else {
				this._image = imageEntity;
			}
		}

		return Promise.resolve();
	}
}

window.customElements.define('d2l-activity-list-item', D2lActivityListItem);
