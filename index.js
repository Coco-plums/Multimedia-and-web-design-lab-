import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filepath = path.join(__dirname, "data.json");
let data = JSON.parse(fs.readFileSync(filepath, "utf-8"));

function saveData() {
	fs.writeFileSync(filepath, JSON.stringify(data, null, 2), "utf-8");
}

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

function parseId(v) {
	const n = Number(v);
	return Number.isNaN(n) ? v : n;
}

// Basic GET endpoints for all top-level entities
const entities = ["students", "instructors", "courses", "enrollments", "assignments", "grades"];
entities.forEach((entity) => {
	app.get(`/api/${entity}`, (req, res) => {
		res.json(data[entity] || []);
	});

	app.get(`/api/${entity}/:id`, (req, res) => {
		const id = parseId(req.params.id);
		const list = data[entity] || [];
		const item = list.find((x) => x.id === id);
		if (!item) return res.status(404).json({ error: `${entity.slice(0, -1)} not found` });
		res.json(item);
	});
});

// Generic write endpoints (Create / Update / Delete)
app.post("/api/:entity", (req, res) => {
	const collection = req.params.entity;
	if (!entities.includes(collection)) return res.status(404).json({ error: "Collection not found" });
	const list = data[collection] || [];
	const maxId = list.reduce((m, it) => (it.id > m ? it.id : m), 0);
	const newItem = { ...req.body, id: maxId + 1 };
	list.push(newItem);
	data[collection] = list;
	saveData();
	res.status(201).json(newItem);
});

app.put("/api/:entity/:id", (req, res) => {
	const collection = req.params.entity;
	if (!entities.includes(collection)) return res.status(404).json({ error: "Collection not found" });
	const id = parseId(req.params.id);
	const list = data[collection] || [];
	const idx = list.findIndex((x) => x.id === id);
	if (idx === -1) return res.status(404).json({ error: "Not found" });
	const updated = { ...list[idx], ...req.body, id: list[idx].id };
	list[idx] = updated;
	data[collection] = list;
	saveData();
	res.json(updated);
});

app.delete("/api/:entity/:id", (req, res) => {
	const collection = req.params.entity;
	if (!entities.includes(collection)) return res.status(404).json({ error: "Collection not found" });
	const id = parseId(req.params.id);
	const list = data[collection] || [];
	const idx = list.findIndex((x) => x.id === id);
	if (idx === -1) return res.status(404).json({ error: "Not found" });
	const removed = list.splice(idx, 1)[0];
	data[collection] = list;
	saveData();
	res.json(removed);
});

// Nested / relationship endpoints
app.get("/api/students/:id/enrollments", (req, res) => {
	const id = parseId(req.params.id);
	const enrollments = (data.enrollments || []).filter((e) => e.studentId === id);
	res.json(enrollments);
});

app.get("/api/students/:id/courses", (req, res) => {
	const id = parseId(req.params.id);
	const studentEnrollments = (data.enrollments || []).filter((e) => e.studentId === id);
	const courses = studentEnrollments.map((en) => data.courses.find((c) => c.id === en.courseId)).filter(Boolean);
	res.json(courses);
});

app.get("/api/courses/:id/students", (req, res) => {
	const id = parseId(req.params.id);
	const courseEnrollments = (data.enrollments || []).filter((e) => e.courseId === id);
	const students = courseEnrollments.map((en) => data.students.find((s) => s.id === en.studentId)).filter(Boolean);
	res.json(students);
});

app.get("/api/instructors/:id/courses", (req, res) => {
	const id = parseId(req.params.id);
	const courses = (data.courses || []).filter((c) => c.instructorId === id);
	res.json(courses);
});

app.get("/api/courses/:id/assignments", (req, res) => {
	const id = parseId(req.params.id);
	const assignments = (data.assignments || []).filter((a) => a.courseId === id);
	res.json(assignments);
});

app.get("/api/enrollments/:id/grades", (req, res) => {
	const id = parseId(req.params.id);
	const grades = (data.grades || []).filter((g) => g.enrollmentId === id);
	res.json(grades);
});

// Helper: map letter grade to numeric (4.0 scale)
const gradeMap = {
	"A": 4.0,
	"A-": 3.7,
	"B+": 3.3,
	"B": 3.0,
	"B-": 2.7,
	"C+": 2.3,
	"C": 2.0,
	"C-": 1.7,
	"D": 1.0,
	"F": 0.0
};

// Advanced queries
app.get("/api/students/:id/gpa", (req, res) => {
	const id = parseId(req.params.id);
	const enrollments = (data.enrollments || []).filter((e) => e.studentId === id && e.grade);
	if (!enrollments.length) return res.json({ gpa: null, message: "No graded enrollments found" });
	const values = enrollments.map((e) => gradeMap[e.grade]).filter((v) => typeof v === "number");
	if (!values.length) return res.json({ gpa: null, message: "No mappable letter grades found" });
	const avg = values.reduce((a, b) => a + b, 0) / values.length;
	res.json({ gpa: Number(avg.toFixed(2)), computedFrom: "enrollments", count: values.length });
});

app.get("/api/courses/:id/average", (req, res) => {
	const id = parseId(req.params.id);
	const enrollments = (data.enrollments || []).filter((e) => e.courseId === id && e.grade);
	const values = enrollments.map((e) => gradeMap[e.grade]).filter((v) => typeof v === "number");
	if (!values.length) return res.json({ average: null, message: "No graded enrollments" });
	const avg = values.reduce((a, b) => a + b, 0) / values.length;
	res.json({ average: Number(avg.toFixed(2)), count: values.length });
});

app.get("/api/instructors/:id/students", (req, res) => {
	const id = parseId(req.params.id);
	const courses = (data.courses || []).filter((c) => c.instructorId === id).map((c) => c.id);
	const enrollments = (data.enrollments || []).filter((e) => courses.includes(e.courseId));
	const studentIds = [...new Set(enrollments.map((e) => e.studentId))];
	const students = studentIds.map((sid) => data.students.find((s) => s.id === sid)).filter(Boolean);
	res.json(students);
});

app.get("/api/students/:id/schedule", (req, res) => {
	const id = parseId(req.params.id);
	const currentEnrollments = (data.enrollments || []).filter((e) => e.studentId === id && e.status === "enrolled");
	const schedule = currentEnrollments.map((en) => {
		const course = data.courses.find((c) => c.id === en.courseId);
		return course ? { courseId: course.id, code: course.code, name: course.name, schedule: course.schedule, semester: en.semester } : null;
	}).filter(Boolean);
	res.json(schedule);
});

// Health
app.get("/", (req, res) => res.send("API Building Practice Dataset — server running."));

app.listen(port, () => {
	// eslint-disable-next-line no-console
	console.log(`Server listening on http://localhost:${port}`);
});



