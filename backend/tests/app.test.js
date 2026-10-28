const request = require("supertest");

jest.mock("../models/Student", () => ({
  find: jest.fn(),
  create: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

const Student = require("../models/Student");
const app = require("../app");

describe("StudentDesk API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET / returns the API status message", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("StudentDesk API is running");
  });

  test("GET /api/students returns students", async () => {
    const students = [{ name: "Ada Lovelace", usn: "CS001" }];
    Student.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(students),
    });

    const response = await request(app).get("/api/students");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(students);
    expect(Student.find).toHaveBeenCalledWith();
  });

  test("POST /api/students creates a student", async () => {
    const student = {
      name: "Ada Lovelace",
      usn: "CS001",
      email: "ada@example.com",
      department: "CSE",
    };
    Student.create.mockResolvedValue(student);

    const response = await request(app).post("/api/students").send(student);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(student);
    expect(Student.create).toHaveBeenCalledWith(student);
  });

  test("POST /api/students returns conflict for duplicate data", async () => {
    Student.create.mockRejectedValue({ code: 11000 });

    const response = await request(app).post("/api/students").send({});

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      message: "A student with this USN or email already exists",
    });
  });

  test("DELETE /api/students/:id deletes an existing student", async () => {
    Student.findByIdAndDelete.mockResolvedValue({ _id: "student-id" });

    const response = await request(app).delete("/api/students/student-id");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Student deleted successfully",
    });
  });

  test("DELETE /api/students/:id returns not found when no student exists", async () => {
    Student.findByIdAndDelete.mockResolvedValue(null);

    const response = await request(app).delete("/api/students/missing-id");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Student not found" });
  });
});
