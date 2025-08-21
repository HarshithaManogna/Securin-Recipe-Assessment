Securin Recipe Data Collection and API Development
This project is a full-stack application that involves parsing recipe data from a JSON file, storing it in a database, and exposing it through a RESTful API. The API is then consumed by a modern, visually rich React-based user interface.

Tech Stack
Backend: Node.js with Express.js

Database: MongoDB

Frontend: React with Material-UI, Tailwind CSS, and React Icons

Project Deliverables
This repository contains all the required components as specified in the assignment document:

Source Code: The complete source code for both the backend (/) and frontend (/securin-frontend).

Database Setup: The instructions for setting up the database are provided in the "Backend Setup" section below.

API Testing: API endpoints, sample requests, and expected responses are documented in the "API Documentation" section.

Frontend UI: A fully functional React application that fulfills all the UI requirements.

Getting Started
Follow these steps to set up and run the application.

Prerequisites
Node.js: The Node.js runtime environment (version 18 or higher) must be installed.

npm: The Node Package Manager, which comes with Node.js.

MongoDB Community Server: The database server must be installed and running on localhost:27017.

Step 1: Backend Setup & Data Insertion
The backend handles the API and database logic.

Navigate to the root directory of the project in your terminal:

cd securin-assignment

Install the backend dependencies:

npm install express mongoose cors

Run the script to parse the US_recipes.json file and insert the data into your MongoDB database. The script handles NaN values by converting them to null before insertion.

node insert-data.js

Step 2: Start the Backend API Server
After the data has been successfully inserted, start the API server.

From the root directory, run the server using nodemon (if installed) or node:

nodemon server.js

The server will start and connect to your MongoDB database. You will see a message confirming it's running on http://localhost:5000.

Step 3: Frontend Setup
The frontend is a React application that fetches data from the backend API.

In a new terminal window, navigate to the frontend directory:

cd securin-frontend

Install the frontend dependencies:

npm install

Step 4: Start the Frontend Application
With the backend server still running, start the React application:

npm start

The application will open in your browser, running on http://localhost:3000. It will automatically connect to your backend API to display the recipe data.

API Documentation
The backend API exposes two main endpoints to interact with the recipe data. All API calls are made to http://localhost:5000.

1. Get All Recipes (Paginated and Sorted)
This endpoint fetches a list of all recipes, sorted by rating in descending order, with support for pagination.

URL: /api/recipes

Method: GET

Query Parameters:

page: Page number (default: 1)

limit: Number of recipes per page (default: 10)

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

2. Search Recipes
This endpoint allows users to search for recipes based on various filters.

URL: /api/recipes/search

Method: GET

Query Parameters:

title: Searches for a partial match in the recipe title.

cuisine: Filters by exact cuisine name.

rating: Filters by rating with operators (e.g., >=4.5).

total_time: Filters by total time with operators (e.g., <=120).

Example Request:

GET /api/recipes/search?title=pie&rating=>=4.5

Example Response:

{
  "data": [
    // ... list of matching recipes
  ]
}
