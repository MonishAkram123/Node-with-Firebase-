const express = require('express');
const session = require('express-session');
const dbManager = require('./dbManager.js');
const hbs = require('hbs'); //hbs the middle ware to add content to web pages dynamically
const app = express();

app.get('/', (req, res) => {
	res.render('index');
});

app.set('view engine', 'hbs');

app.get('/login', (req, res)=> {
	var user = req.query;
	var loginDetails = {
		ID: user.username,
		Password: user.password
	};
	dbManager.getUser(loginDetails, (error, result) => {
		if(error) {
			console.log(error);
			res.send("<h1 align=center> Unable to Login</h1>");
		}
		else {
			var name = result.Name;
			dbManager.getTeacherList((error, result) => {
				// if(error)
				// 	console.log('Error in Database');
				// else {
					res.render('mainPage', {user: name,teachers: result});		
				// }
			});
		}
	})
});


app.get('/register', (req, res) => {
	var user  = req.query;
	var userDetails = {
		ID: user.username,
		Name: user.name,
		Password: user.password,
		Contact: user.contact,
		Note: user.note
	};
	dbManager.registerNewUser(userDetails, (error) => {
		if(error) {
			console.log(error);
			res.send("Error While Registration");
		}
		else
			res.send(`<h1 align=center> User registered successfully</h1>`);
	});
});

app.get('/registerStudent', (req, res) => {
	var newStudent = req.query;
	var studentDetails = {
		Name: newStudent.name,
		RegistrationID: newStudent.registrationID,
		SubjectList: newStudent.subject,
		TeacherID: newStudent.teacher
	};
	dbManager.addNewStudent(studentDetails, (error) => {
		if(error) {
			console.log(error);
			res.send("Something bad happend");
		}
		else 
			res.render('success.hbs', {message:'Student Registered Successfully'});
	});
});

app.get('/registerTeacher', (req, res) => {
	var newTeacher = req.query;
	var teacherDetails = {
		Name: newTeacher.name,
		TeacherID: newTeacher.teacherID,
		FavSubject: newTeacher.subject,
		Salary: newTeacher.salary
	}
	dbManager.addNewTeacher(teacherDetails, (error) => {
		if(error) {
			console.log(error);
			res.send("Something bad happend");
		}
		else {
			res.render('success.hbs', {message: 'Teacher Registered Successfully'})
		}
	})
})

app.get('/getStudentList', (req, res) => {
	dbManager.getStudentList((error, result) => {
		if(error) {
			console.log('Something bad happend');
			res.render('faliure.hbs', {message: 'Database is empty found'});
		}
		else {
			var studentList = result.filter(student => student.TeacherID === req.query.teacherID);
			res.render('studentTable', {studentList});
		}
	});
});

app.listen(3000, () => {
	console.log('Listening on 3000');
});