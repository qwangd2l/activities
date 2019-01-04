describe('d2l-activity-list-item', () => {

	var component,
		fetchStub,
		sandbox,
		activityEntity,
		organizationEntity,
		imageEntity;

	function SetupFetchStub(url, entity) {
		fetchStub.withArgs(sinon.match.has('url', sinon.match(url)))
			.returns(Promise.resolve({
				ok: true,
				json: () => { return Promise.resolve(entity); }
			}));
	}

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
		activityEntity = window.D2L.Hypermedia.Siren.Parse({
			class:['activity'],
			properties:{
				description: 'Financial Planning & Analysis: Building a Company\'s Budget from Scratch guides you through the core principles of Financial Planning and helps you to understand how a company prepares its budget. The video lessons touch on several awesome. Ultra-Financial Planning & Analysis in the 20th Century: Building a Successful Budget'
			},
			links: [{
				rel:['self'],
				href: '/activity/1'
			}, {
				rel:['https://api.brightspace.com/rels/organization'],
				href:'/organization/1'
			}],
			actions:[{
				href:'/activity/1',
				name:'assign',
				method:'PUT'
			}]
		});
		organizationEntity = window.D2L.Hypermedia.Siren.Parse({
			class: ['active', 'course-offering'],
			properties: {
				name: 'Course name',
				code: 'COURSE100',
				startDate: null,
				endDate: null,
				isActive: true
			},
			links: [{
				rel: ['self'],
				href: '/organizations/1'
			}],
			entities: [
				{
					class: ['course-image'],
					rel: ['https://api.brightspace.com/rels/organization-image'],
					href: '/organization/1/image/1'
				}
			],
			actions: []
		});
		imageEntity = window.D2L.Hypermedia.Siren.Parse({
			rel: ['https://api.brightspace.com/rels/organization-image'],
			class: ['course-image'],
			propeties: {
				name: '1.jpg',
				type: 'image/jpeg'
			},
			links: [{
				rel: ['self'],
				href: '/organization/1/image/1'
			}, {
				rel: ['alternate'],
				href: '',
				class: ['tile']
			}]
		});
		fetchStub = sandbox.stub(window.d2lfetch, 'fetch');
		SetupFetchStub(/\/activity\/1$/, activityEntity);
		SetupFetchStub(/\/organization\/1$/, organizationEntity);
		SetupFetchStub(/\/organization\/1\/image\/1$/, imageEntity);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('loads element', () => {
		component = fixture('d2l-activity-list-item-empty-fixture');
		expect(component).to.exist;
	});

	[
		{
			name: 'Setting the href attribute',
			beforeEachFn: () => {
				component = fixture('d2l-activity-list-item-href-fixture');
			}
		},
		{
			name: 'Setting the entity attribute',
			beforeEachFn: () => {
				component = fixture('d2l-activity-list-item-empty-fixture');
				component.entity = activityEntity;
			}
		}
	].forEach((testCase) => {
		describe(testCase.name, () => {

			beforeEach(testCase.beforeEachFn);

			it('should set the href', (done) => {
				setTimeout(() => {
					expect(component.href).to.equal('/activity/1');
					done();
				});
			});

			it('should set entity', (done) => {
				setTimeout(() => {
					expect(component.entity).to.equal(activityEntity);
					done();
				});
			});

			it('should fetch the organization', (done) => {
				setTimeout(() => {
					expect(component._organizationUrl).to.equal('/organization/1');
					done();
				});
			});

			it('should set the image entity', (done) => {
				setTimeout(() => {
					expect(component._image).to.equal(imageEntity);
					done();
				});
			});

		});

	});

	describe('Accessibility', () => {

		beforeEach(() => component = fixture('d2l-activity-list-item-href-fixture'));

		it('Organization', done => {
			component.fire('d2l-organization-accessible', {
				organization: {
					name: 'Course name'
				}
			});

			setTimeout(() => {
				expect(component._accessibilityData.organizationName).to.equal('Course name');
				var accessibilityText = component.$$('.d2l-activity-list-item-link-text').innerHTML;
				expect(accessibilityText).to.contain('Course name');
				done();
			});

		});

	});

	describe('Responsive Behaviour', () => {
		it('Description is hidden at width 384', done => {
			component = fixture('d2l-activity-list-item-responsive-384-fixture');
			setTimeout(() => {
				expect(component._showDescription).to.be.false;
				var description = component.$$('.d2l-activity-list-item-description');
				expect(description.hasAttribute('hidden')).to.be.true;
				done();
			}, 200);
		});

		it('Description is not hidden at width 385', done => {
			component = fixture('d2l-activity-list-item-responsive-385-fixture');
			setTimeout(() => {
				expect(component._showDescription).to.be.true;
				var description = component.$$('.d2l-activity-list-item-description');
				expect(description.hasAttribute('hidden')).to.be.false;
				done();
			}, 200);
		});

	});

});
