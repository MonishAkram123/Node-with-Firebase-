const firebase = require('firebase-admin');
var serviceAccount = require('./service-account.json');


//Firebase database Connection Information
firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount),
	databaseURL: '' //FireBase Database Path
});

var registerNewUser = (userDetails, callback) => {
	var dbReference = firebase.database().ref('UserList');
	var userRef = dbReference.child(userDetails.ID);
	userRef.set(userDetails, callback);
};

var getUser = (userDetails, callback) => {
	var dbReference = firebase.database().ref('UserList/' +userDetails.ID);
	dbReference.on('value', (snap) => {
		if(!snap.val())
			callback(`No user found with name ${userDetails.ID}`);
		else if(userDetails.Password === snap.val().Password)
			callback(undefined, snap.val());
		else
			callback("Invalid Password");
	})

}

var addNewStudent = (studentDetails, callback) => {
	var dbReference = firebase.database().ref('StudentList');
	var studentRef = dbReference.child(studentDetails.RegistrationID);
	studentRef.set(studentDetails, callback);
}

var addNewTeacher = (teacherDetails, callback) => {
	var dbReference = firebase.database().ref('TeacherList');
	var teacherRef = dbReference.child(teacherDetails.TeacherID);
	teacherRef.set(teacherDetails, callback);
}
var getTeacherList = (callback) => {
	var dbReference = firebase.database().ref('TeacherList');
	dbReference.once('value', (snap) => {
		if(!snap.val())
			callback(`Something went wrong`);
		else {
			var teachers = [];
			for(teacher in snap.val()) 
				teachers.push(teacher);
			var teacherList = [];
			teachers.forEach(teacher => teacherList.push(snap.val()[teacher]));
			callback(undefined, teacherList);
		}
	});
}
var getStudentList = (callback) => {
	dbReference = firebase.database().ref('StudentList');
	dbReference.once('value', (snap) => {
		if(!snap.val())
			callback("Something went wrong");
		else {
			var students = [];
			for(student in snap.val())
				students.push(student);
			var studentList = [];
			students.forEach(student => studentList.push(snap.val()[student]));
			callback(undefined, studentList);
		}
	});

}
module.exports = {
	registerNewUser,
	getUser,
	addNewStudent,
	addNewTeacher,
	getTeacherList,
	getStudentList
};
