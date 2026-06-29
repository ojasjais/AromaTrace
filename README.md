# AromaTrace

AromaTrace is a full-stack application for managing and tracking essential oil production batches.

## Features

* Batch Management
* REST APIs
* Search Functionality
* Responsive UI
* Dark Mode Support
* Frontend and Backend Integration

## Technologies Used

* React.js
* Tailwind CSS
* Node.js
* Express.js
* Postman
* Git & GitHub

## How to Run Frontend

```bash
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## How to Run Backend Locally

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Run the server:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

## API Endpoints

* GET /api/batches
* GET /api/batches/:id
* POST /api/batches
* PUT /api/batches/:id
* DELETE /api/batches/:id
* GET /api/batches/search/:name
