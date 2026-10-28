
import { useEffect, useState } from "react";
import "./App.css";


function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    usn: "",
    email: "",
    department: "ISE",
  });

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/students"
        );

        if (!response.ok) {
          throw new Error("Failed to load students.");
        }

        const data = await response.json();
        setStudents(data);
      } catch (error) {
        setError(
          error.message === "Failed to load students."
            ? error.message
            : "Cannot connect to the server. Check whether the backend is running."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }


async function handleSubmit(event) {
  event.preventDefault();
  setError("");

  try {
    const response = await fetch(
      "http://localhost:5000/api/students",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add student.");
    }

    setStudents((previousStudents) => [
      data,
      ...previousStudents,
    ]);

    setForm({
      name: "",
      usn: "",
      email: "",
      department: "ISE",
    });
  } catch (error) {
    setError(error.message);
  }
}


  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/students/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete student.");
      }

      setStudents((previousStudents) =>
        previousStudents.filter((student) => student._id !== id)
      );
    } catch (error) {
      setError(error.message);
    }
  }

  const filteredStudents = students.filter((student) => {
    const query = search.toLowerCase();

    return (
      student.name.toLowerCase().includes(query) ||
      student.usn.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.department.toLowerCase().includes(query)
    );
  });

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <span>StudentDesk</span>
        </div>

        <p className="nav-heading">WORKSPACE</p>
        <div className="nav-item active">
          <span>▦</span> Students
        </div>

        <div className="sidebar-footer">
          <div className="avatar">SD</div>
          <div>
            <strong>Student Admin</strong>
            <small>Management portal</small>
          </div>
        </div>
      </aside>

      <main className="main-content">
        {error && (
          <p role="alert" className="error-message">
            {error}
          </p>
        )}
        <header className="topbar">
          <span>Workspace / Students</span>
          <span className="status"><span /> Student Management</span>
        </header>

        <section className="page-heading">
          <div>
            <p className="eyebrow">OVERVIEW</p>
            <h1>Students</h1>
            <p className="subtitle">
              Manage student records in one place.
            </p>
          </div>

          <div className="total-badge">
            <span>Total students</span>
            <strong>{students.length}</strong>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon purple">♙</span>
            <p>Total students</p>
            <h2>{students.length}</h2>
            <small>All registered records</small>
          </div>

          <div className="stat-card">
            <span className="stat-icon blue">▤</span>
            <p>Departments</p>
            <h2>
              {new Set(students.map((student) => student.department)).size}
            </h2>
            <small>Departments represented</small>
          </div>

          <div className="stat-card">
            <span className="stat-icon green">✓</span>
            <p>Currently viewing</p>
            <h2>{filteredStudents.length}</h2>
            <small>Records matching your search</small>
          </div>
        </section>

        <section className="content-card">
          <div className="section-heading">
            <div>
              <h2>Add a student</h2>
              <p>Enter the student's details below.</p>
            </div>
          </div>

          <form className="student-form" onSubmit={handleSubmit}>
            <label>
              Full name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Priya Sharma"
                required
              />
            </label>

            <label>
              USN
              <input
                name="usn"
                value={form.usn}
                onChange={handleChange}
                placeholder="e.g. 1RV24IS001"
                required
              />
            </label>

            <label>
              Email address
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="student@example.com"
                required
              />
            </label>

            <label>
              Department
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
              >
                <option value="CSE">CSE</option>
                <option value="ISE">ISE</option>
                <option value="ECE">ECE</option>
                <option value="ME">ME</option>
              </select>
            </label>

            <button className="primary-button" type="submit">
              + Add student
            </button>
          </form>
        </section>

        <section className="content-card">
          <div className="section-heading table-heading">
            <div>
              <h2>Student directory</h2>
              <p>Browse and manage registered students.</p>
            </div>

            <input
              className="search-input"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search students..."
              aria-label="Search students"
            />
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>STUDENT</th>
                  <th>USN</th>
                  <th>EMAIL</th>
                  <th>DEPARTMENT</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      Loading students...
                    </td>
                  </tr>
                )}
                {!loading && filteredStudents.map((student) => (
                  <tr key={student._id}>
                    <td>
                      <div className="student-cell">
                        <div className="student-avatar">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <strong>{student.name}</strong>
                      </div>
                    </td>
                    <td>{student.usn}</td>
                    <td>{student.email}</td>
                    <td>
                      <span className="department-tag">
                        {student.department}
                      </span>
                    </td>
                    <td>
                      <button
                        className="delete-button"
                        type="button"
                        onClick={() => handleDelete(student._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {!loading && filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      No students found. Try another search or add a student.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </section>

        <footer className="page-footer">
          StudentDesk · Student records made simple
        </footer>
      </main>
    </div>
  );
}

export default App;
