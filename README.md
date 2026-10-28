# StudentDesk

StudentDesk is a student management portal built with React, Express, and MongoDB. It allows administrators to view, search, add, and delete student records.

## Features

- View all student records
- Search by name, USN, email, or department
- Add a student with name, USN, email, and department
- Delete an existing student
- Duplicate USN and email handling
- Responsive React frontend
- REST API backed by MongoDB

## Technology stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Testing:** Jest and Supertest

## Project structure

```text
studentdesk/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   ├── .env.example
│   ├── app.js
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js 18 or later
- npm
- A MongoDB instance, such as MongoDB Atlas

## Setup

Clone the repository and install dependencies in both application directories:

```bash
cd studentdesk/backend
npm install

cd ../frontend
npm install
```

Create the backend environment file:

```bash
cd ../backend
copy .env.example .env
```

On macOS or Linux, use `cp .env.example .env` instead.

Update `backend/.env` with your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studentdesk
PORT=5000
```

Do not commit `backend/.env`. It is excluded by `.gitignore`.

## Running the application

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open the frontend URL shown by Vite, normally `http://localhost:5173`.

The backend API runs at `http://localhost:5000`.

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Check API status |
| `GET` | `/api/students` | Fetch all students |
| `POST` | `/api/students` | Create a student |
| `DELETE` | `/api/students/:id` | Delete a student |

Supported departments are `CSE`, `ISE`, `ECE`, and `ME`.

## Tests and checks

Run backend API tests:

```bash
cd backend
npm test
```

Run frontend linting:

```bash
cd frontend
npm run lint
```

Create a production frontend build:

```bash
cd frontend
npm run build
```

The backend tests mock the Student model, so they do not require a live MongoDB connection.
