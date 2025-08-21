# Securin Recipe Data Collection and API Development

This project is a full-stack application that involves parsing recipe data from a JSON file, storing it in a database, and exposing it through a RESTful API. The API is then consumed by a modern, visually rich React-based user interface.

---

## Tech Stack
- **Backend**: Node.js with Express.js  
- **Database**: MongoDB  
- **Frontend**: React with Material-UI, Tailwind CSS, and React Icons  

---

## Project Deliverables
This repository contains all the required components as specified in the assignment document:

- **Source Code**: The complete source code for both the backend (`/`) and frontend (`/securin-frontend`).  
- **Database Setup**: Instructions for setting up the database are provided in the **Backend Setup** section.  
- **API Testing**: API endpoints, sample requests, and expected responses are documented in the **API Documentation** section.  
- **Frontend UI**: A fully functional React application that fulfills all the UI requirements.  

---

## Getting Started
Follow these steps to set up and run the application.

### Prerequisites
- Node.js (v18 or higher)  
- npm (comes with Node.js)  
- MongoDB (running on `localhost:27017`)  

---

### Step 1: Backend Setup & Data Insertion
cd securin-assignment  
npm install express mongoose cors  
node insert-data.js  

### Step 2: Start the Backend API Server
nodemon server.js   # or use: node server.js  
Server runs at http://localhost:5000  

### Step 3: Frontend Setup
cd securin-frontend  
npm install  

### Step 4: Start the Frontend Application
npm start  
React app runs at http://localhost:3000  

---

## API Documentation
The backend API exposes two main endpoints to interact with recipe data.  
Base URL: http://localhost:5000  

---

### 1. Get All Recipes (Paginated & Sorted)
Fetches all recipes, sorted by rating (desc), with pagination.

- URL: /api/recipes  
- Method: GET  
- Query Parameters:  
  - page: Page number (default: 1)  
  - limit: Recipes per page (default: 10)  

Example Request:  
GET /api/recipes?page=2&limit=5  

Example Response:  
{
  "page": 2,
  "limit": 5,
  "total": 8451,
  "data": [
    // ... list of 5 recipes sorted by rating
  ]
}

---

### 2. Search Recipes
Search recipes with filters.

- URL: /api/recipes/search  
- Method: GET  
- Query Parameters:  
  - title: Partial match in recipe title  
  - cuisine: Filter by cuisine name  
  - rating: Filter by rating (>=4.5)  
  - total_time: Filter by time (<=120)  

Example Request:  
GET /api/recipes/search?title=pie&rating=>=4.5  

Example Response:  
{
  "data": [
    // ... list of matching recipes
  ]
}
