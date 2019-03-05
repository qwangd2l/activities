function compare(x, y) {
	if (x < y) {
		return -1;
	}
	if (x > y) {
		return 1;
	}
	return 0;
}

export default
{
	sorts: [
		{
			'class': 'courseName',
			'id': 'bycourse',
			'fn': (x, y) => {
				const xname = x.rowData.courseName;
				const yname = y.rowData.courseName;
				return compare(xname, yname);
			}
		},
		{
			'class': 'displayName',
			'id': 'byuser',
			'fn': (x, y) => {
				const xname = x.rowData.firstName + ' ' + x.rowData.lastName;
				const yname = y.rowData.firstName + ' ' + y.rowData.lastName;
				return compare(xname, yname);
			}
		},
		{
			'class': 'activityName',
			'id': 'byactivity',
			'fn': (x, y) => {
				const xname = x.rowData.activityName;
				const yname = y.rowData.activityName;
				return compare(xname, yname);
			}
		},
		{
			'class': 'submissionDate',
			'id': 'bydate',
			'fn': (x, y) => {
				const xname = x.rowData.submissionDate;
				const yname = y.rowData.submissionDate;
				return compare(xname, yname);
			}
		},
		{
			'class': 'masterTeacher',
			'id': 'byteacher',
			'fn': (x, y) => {
				const xname = x.rowData.masterTeacher.firstName + ' ' + x.rowData.masterTeacher.lastName;
				const yname = y.rowData.masterTeacher.firstName + ' ' + y.rowData.masterTeacher.lastName;
				return compare(xname, yname);
			}
		}
	],
	data: [
		{
			'firstName': 'Alex',
			'lastName': 'Bedley',
			'activityType': 'assignment',
			'activityName': 'What is Love?',
			'courseName': 'Music 304 - A Study of Haddaway',
			'submissionDate': '2019-02-20T02:00:00.000Z',
			'masterTeacher': {
				'firstName': 'Brett',
				'lastName': 'Hertzberger'
			}
		},
		{
			'firstName': 'Alex',
			'lastName': 'Bedley',
			'activityType': 'assignment',
			'activityName': 'The Bestest Number',
			'courseName': 'Math 102 - Numbers',
			'submissionDate': '2019-02-19T02:00:00.000Z',
			'masterTeacher': {
				'firstName': 'Chris',
				'lastName': 'Alexander'
			}
		},
		{
			'firstName': 'Stacey',
			'lastName': 'Van Herk',
			'activityType': 'assignment',
			'activityName': 'The Bestest Number',
			'courseName': 'Math 102 - Numbers',
			'submissionDate': '2019-02-20T02:00:00.000Z',
			'masterTeacher': {
				'firstName': 'Chris',
				'lastName': 'Alexander'
			}
		},
		{
			'firstName': 'Carol',
			'lastName': 'Busman',
			'activityType': 'assignment',
			'activityName': 'The Bestest Number',
			'courseName': 'Math 102 - Numbers',
			'submissionDate': '2019-02-18T02:00:00.000Z',
			'masterTeacher': {
				'firstName': 'Chris',
				'lastName': 'Alexander'
			}
		},
		{
			'firstName': 'Viktor',
			'lastName': 'Yakovlyev',
			'activityType': 'discussion',
			'activityName': 'Was Shakespeare secretly illiterate?',
			'courseName': 'Literature 303 - Real Talks',
			'submissionDate': '2019-01-01T02:00:00.000Z',
			'masterTeacher': {
				'firstName': 'Surekha',
				'lastName': 'Rao'
			}
		},
		{
			'firstName': 'Jamie',
			'lastName': 'Murray',
			'activityType': 'quiz',
			'activityName': "Months that start with 'Feb'",
			'courseName': 'Arts 101 - Underwater Basket Weaving',
			'submissionDate': '2019-01-16T02:00:00.000Z',
			'masterTeacher': {
				'firstName': 'Tina',
				'lastName': 'Fletcher'
			}
		},
		{
			'firstName': 'Amaury',
			'lastName': 'Perez',
			'activityType': 'quiz',
			'activityName': "Months that start with 'Feb'",
			'courseName': 'Arts 101 - Underwater Basket Weaving',
			'submissionDate': '2019-01-15T02:00:00.000Z',
			'masterTeacher': {
				'firstName': 'Tina',
				'lastName': 'Fletcher'
			}
		}
	]
};
