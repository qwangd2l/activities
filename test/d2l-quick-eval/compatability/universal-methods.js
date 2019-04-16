import { StringEndsWith } from '../../../components/d2l-quick-eval/compatability/universal-methods.js';

suite('StringEndsWith', () => {
	const testCases = [
		{ str: undefined, endingStr: undefined, expectedResult: false },
		{ str: undefined, endingStr: null, expectedResult: false },
		{ str: undefined, endingStr: '', expectedResult: false },
		{ str: null, endingStr: '', expectedResult: false },
		{ str: null, endingStr: undefined, expectedResult: false },
		{ str: null, endingStr: null, expectedResult: false },
		{ str: 'racecar', endingStr: undefined, expectedResult: false },
		{ str: 'racecar', endingStr: null, expectedResult: false },
		{ str: 'racecar', endingStr: 'racecar ', expectedResult: false },
		{ str: 'racecar', endingStr: ' ', expectedResult: false },
		{ str: 'racecar', endingStr: 'car', expectedResult: true },
		{ str: 'racecar', endingStr: 'r', expectedResult: true },
		{ str: 'racecar', endingStr: '', expectedResult: true }
	];

	testCases.forEach(function(testCase) {
		const str = testCase.str;
		const endingStr = testCase.endingStr;
		const expectedResult = testCase.expectedResult;

		test(`String ${str} should return ${expectedResult} when checking for ${endingStr}`, () => {
			assert.equal(expectedResult, StringEndsWith(str, endingStr));
		});
	});
});
