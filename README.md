[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/MPD2KS2G)
# API Building Practice Dataset

This dataset contains realistic university data for practicing API development. The data includes students, instructors, courses, enrollments, assignments, and grades with relationships between entities.

### Entities

1. **Students** (8 records)
   - id, firstName, lastName, email, enrollmentDate, major, gpa, year, active

2. **Instructors** (5 records)
   - id, firstName, lastName, email, department, hireDate, officeLocation, specialty

3. **Courses** (7 records)
   - id, code, name, credits, department, instructorId, capacity, schedule, prerequisites

4. **Enrollments** (14 records)
   - id, studentId, courseId, enrollmentDate, grade, status, semester

5. **Assignments** (6 records)
   - id, courseId, title, description, dueDate, maxPoints, type

6. **Grades** (6 records)
   - id, enrollmentId, assignmentId, score, submittedDate, feedback

## Quick start

1. Copy the dataset JSON files into a `data/` folder (suggested filenames below).
2. Serve the files or load them into your API mock/server (e.g., json-server, Express).
3. Implement RESTful endpoints described below and point them to the corresponding JSON resources.

## Data format & sample

Suggested data file names:
- data/students.json
- data/instructors.json
- data/courses.json
- data/enrollments.json
- data/assignments.json
- data/grades.json

Students JSON sample:
```json
[
  {
    "id": 1,
    "firstName": "Aisha",
    "lastName": "Khan",
    "email": "aisha.khan@example.edu",
    "enrollmentDate": "2021-08-23",
    "major": "Computer Science",
    "gpa": 3.75,
    "year": "Sophomore",
    "active": true
  },
  {
    "id": 2,
    "firstName": "Daniel",
    "lastName": "Ortiz",
    "email": "daniel.ortiz@example.edu",
    "enrollmentDate": "2020-09-01",
    "major": "Mathematics",
    "gpa": 3.42,
    "year": "Junior",
    "active": true
  }
]
```

## Endpoints mapping (quick reference)

- Students
  - GET /api/students
  - GET /api/students/:id
  - GET /api/students/:id/enrollments
  - GET /api/students/:id/courses
  - GET /api/students/:id/gpa
  - GET /api/students/:id/schedule

- Instructors
  - GET /api/instructors
  - GET /api/instructors/:id
  - GET /api/instructors/:id/courses
  - GET /api/instructors/:id/students

- Courses
  - GET /api/courses
  - GET /api/courses/:id
  - GET /api/courses/:id/students
  - GET /api/courses/:id/assignments
  - GET /api/courses/:id/average

- Enrollments
  - GET /api/enrollments
  - GET /api/enrollments/:id
  - GET /api/enrollments/:id/grades

- Assignments
  - GET /api/assignments
  - GET /api/assignments/:id

- Grades
  - GET /api/grades
  - GET /api/grades/:id

## Notes

- Use the sample JSON structure above as a template for other entity files.
- Keep IDs consistent across files to preserve relationships (studentId, courseId, enrollmentId, assignmentId).

