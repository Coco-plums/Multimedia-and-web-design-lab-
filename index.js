import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";
import express from "express";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filepath = path.join(__dirname, "data.json");
const data = JSON.parse(fs.readFileSync(filepath, "utf-8"));

const PORT = 3000

app.get("/api/students", (request, response) => {
    response.json({
        students: data.students,
    })
})

app.get("/api/students/:id", (request, response) => {
    const params = request.params;
    console.log(params);

    const id = request.params.id;
    console.log(id);
    const student = data.students.find(el => params.id === id);

    response.json({
        student
    })
})

//level 2
//get student's enrollments
app.get("/api/students/:id/enrolments", (request, response) => {
    const params = request.params;
    console.log(params);

    const studentId = request.params.id;
    console.log(studentId);
    const studentEnrolment = data.enrollments.find(el => params.id === studentId);

    response.json({
        studentEnrolment
    })
})

//get student's courses
app.get("/api/students/:id/courses", (request, response) => {
    const params = request.params;
    console.log(params);

    const studentId = Number(request.params.id);
    console.log(studentId);

    const enrollments = data.enrollments.filter(
        enrollment => enrollment.studentId === studentId
    );
    const studentCourses = [];

    for(const enrollment of enrollments){
        const studentCourse = data.courses.find(
            course => course.id === enrollment.courseId
        )
        studentCourses.push(studentCourse);
    }

    response.json({
        studentCourses
    })
})


//get students in a course
app.get("/api/courses/:id/students", (request, response) => {
    const params = request.params;
    console.log(params);
    const courseId = Number(request.params.id);
    console.log(courseId);

    const enrollments = data.enrollments.filter(
        enrollment => enrollment.courseId === courseId
    )

    const courseStudents = []

    for(const enrollment of enrollments){
        const student = data.students.find(
            student => student.id === enrollment.studentId
        )
        courseStudents.push(student)
    }

    response.json({
        courseStudents
    })
})

//get instructor's courses
app.get("/api/instructors/:id/courses", (request, response) => {
    const params = request.params;
    console.log(params);
    const instructorId = Number(request.params.id);
    console.log(instructorId);

    c


})


app.listen(PORT, (request, response) => {
    console.log(`Server running on port: ${PORT}`);
})
