
const Student = require("../models/Student");

// GET: Fetch all students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

// POST: Add a new student
const createStudent = async (req, res) => {
  try {
    const { name, usn, email, department } = req.body;

    const student = await Student.create({
      name,
      usn,
      email,
      department,
    });

    res.status(201).json(student);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "A student with this USN or email already exists",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Failed to create student" });
  }
};

// DELETE: Remove a student by MongoDB ID
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    res.status(500).json({ message: "Failed to delete student" });
  }
};

module.exports = {
  getStudents,
  createStudent,
  deleteStudent,
};
