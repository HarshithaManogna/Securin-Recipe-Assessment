const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // This allows your frontend to make requests to the backend.

const app = express();
const PORT = 5000;

// Middleware to parse JSON bodies and enable CORS
app.use(express.json());
app.use(cors());

// --- Database Connection ---
const MONGODB_URI = 'mongodb://127.0.0.1:27017/recipes_db';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully for API!'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Mongoose Schema and Model ---
const recipeSchema = new mongoose.Schema({
    cuisine: String,
    title: String,
    rating: Number,
    prep_time: Number,
    cook_time: Number,
    total_time: Number,
    description: String,
    nutrients: Object,
    serves: String,
});
const Recipe = mongoose.model('Recipe', recipeSchema);

// --- API Endpoints ---

// Endpoint 1: Get All Recipes (Paginated and Sorted)
app.get('/api/recipes', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const recipes = await Recipe.find({})
            .sort({ rating: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Recipe.countDocuments();

        res.json({
            page,
            limit,
            total,
            data: recipes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint 2: Search Recipes
app.get('/api/recipes/search', async (req, res) => {
    try {
        const filters = {};
        
        // Parse and build the query filters based on the request parameters
        if (req.query.title) {
            filters.title = { $regex: req.query.title, $options: 'i' };
        }
        if (req.query.cuisine) {
            filters.cuisine = req.query.cuisine;
        }

        // Handle numeric filters with operators (<=, >=, =)
        const parseNumericFilter = (param, field) => {
            if (param) {
                const match = param.match(/(<=|>=|=)(\d+\.?\d*)/);
                if (match) {
                    const operator = match[1];
                    const value = parseFloat(match[2]);
                    switch (operator) {
                        case '<=': filters[field] = { $lte: value }; break;
                        case '>=': filters[field] = { $gte: value }; break;
                        case '=': filters[field] = value; break;
                    }
                }
            }
        };

        parseNumericFilter(req.query.calories, 'nutrients.calories');
        parseNumericFilter(req.query.total_time, 'total_time');
        parseNumericFilter(req.query.rating, 'rating');
        
        const recipes = await Recipe.find(filters);
        res.json({ data: recipes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});