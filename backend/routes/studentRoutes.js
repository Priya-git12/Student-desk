
const express = require("express");
const router = express.Router();

const {
  getStudents,
  createStudent,
  deleteStudent,
} = require("../controllers/studentController");

router.get("/", getStudents);
router.post("/", createStudent);
router.delete("/:id", deleteStudent);

module.exports = router;
