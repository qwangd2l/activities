describe('d2l-activity-card', () => {

	const testTitle = 'test title';
	const testActivityId = 654321;
	const testStatus = 'overdue';
	const testActivityUrl = 'javascripvoid(0)';
	const testDuration = 123456;
	const testDurationUnit = 'Years';
	const testDefaultDurationUnit = 'Minutes';
	const testImageHref =  '/data/image.json';
	const testImage = {
		'class':[
			'course-image'
		],
		'links':[
			{
				'class':[
					'tile',
					'low-density',
					'max'
				],
				'rel':[
					'alternate'
				],
				'type':'image/jpeg',
				'href':'./images/image.jpg'
			}
		]
	};

	var component,
		fetchStub,
		sandbox,
		activityEntity,
		activityEntity2;

	function SetupFetchStub(url, entity) {
		fetchStub.withArgs(sinon.match.has('url', sinon.match(url)))
			.returns(Promise.resolve({
				ok: true,
				json: () => { return Promise.resolve(entity); }
			}));
	}

	function loadActivity(done, dataHref) {
		var spy = sandbox.spy(component, '_handleActivityData');

		component.dataHref = dataHref;

		setTimeout(() => {
			expect(spy).to.have.been.calledOnce;
			done();
		});
	}

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
		activityEntity = window.D2L.Hypermedia.Siren.Parse({
			properties: {
				activityId: testActivityId,
				href: testActivityUrl,
				status: testStatus,
				duration: testDuration,
				durationUnit: testDurationUnit,
				imageHref: testImageHref,
				name: testTitle
			}

		});
		activityEntity2 = window.D2L.Hypermedia.Siren.Parse({
			properties: {
				activityId: testActivityId,
				href: testActivityUrl,
				duration: testDuration,
				imageHref: testImageHref,
				name: testTitle
			}

		});
		fetchStub = sandbox.stub(window.d2lfetch, 'fetch');
		SetupFetchStub(/\/activities\/1$/, activityEntity);
		SetupFetchStub(/\/activities\/2$/, activityEntity2);
		SetupFetchStub(/\/data\/image\.json/, testImage);

		component = fixture('d2l-activity-card-fixture');
		Polymer.dom.flush();
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('loads element', () => {
		expect(component).to.exist;
	});

	describe('Public API', () => {

		it('should implement all properties', () => {
			expect(component.dataHref).to.equal(null);
		});

	});

	describe('Setting the data href attribute which provides all fields', () => {

		beforeEach(done => loadActivity(done, '/activities/1'));

		it('should set the activity data href', () => {
			expect(component.dataHref).to.equal('/activities/1');
		});

		it('should set the activityId', () => {
			expect(component._activityId).to.equal(testActivityId);
		});

		it('should set the status', () => {
			expect(component._status).to.equal(testStatus);
		});

		it('should set the duration', () => {
			expect(component._duration).to.equal(testDuration);
		});

		it('should set the durationUnit', () => {
			expect(component._durationUnit).to.equal(testDurationUnit);
		});

		it('should set the activity url', () => {
			expect(component._activityUrl).to.equal(testActivityUrl);
		});

		it('should set the organization name', () => {
			expect(component.$$('d2l-organization-name')).to.exist;
		});

		it('should set the image', () => {
			expect(JSON.stringify(component._image)).to.equal(JSON.stringify(window.D2L.Hypermedia.Siren.Parse(testImage)));
		});

		it('specified duration unit is displayed', () => {
			assert.equal(component.$$('.durationLabel').innerHTML, `${testDuration} ${testDurationUnit}`);
		});

		it('should have a status indicator if the status is valid', () => {
			expect(component.$$('d2l-status-indicator')).to.exist;
		});

	});

	describe('Setting the data href attribute which does not provide a status or duration unit', () => {

		beforeEach(done => loadActivity(done, '/activities/2'));

		it('default duration unit is displayed when duration unit is not provided', () => {
			assert.equal(component.$$('.durationLabel').innerHTML, `${testDuration} ${testDefaultDurationUnit}`);
		});

		it('should not have a status indicator if the status is not valid or not present', () => {
			expect(component.$$('d2l-status-indicator')).to.not.exist;
		});

	});
});
