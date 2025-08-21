const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Step 1: Define the path to your JSON file and read it.
// We'll use the same parsing logic that we know works.
const filePath = path.join(__dirname, 'US_recipes.json');
const rawDataString = fs.readFileSync(filePath, 'utf8');
const correctedDataString = rawDataString.replace(/NaN/g, 'null');
const recipes = Object.values(JSON.parse(correctedDataString));

// Step 2: Define a Mongoose schema for the recipes.
// This tells Mongoose what the data should look like.
const recipeSchema = new mongoose.Schema({
    cuisine: String,
    title: String,
    rating: Number,
    prep_time: Number,
    cook_time: Number,
    total_time: Number,
    description: String,
    nutrients: Object, // `Object` is a good type for the nested nutrients data.
    serves: String,
});

// Step 3: Create a Mongoose model.
// The model is what you'll use to interact with the database.
const Recipe = mongoose.model('Recipe', recipeSchema);

// Step 4: A function to connect to the database and insert the data.
async function insertRecipes() {
    try {
        // Connect to MongoDB. The name of the database will be `recipes_db`.
        await mongoose.connect('mongodb://127.0.0.1:27017/recipes_db', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully!');

        // Check if the collection is not empty to avoid adding duplicate data.
        const count = await Recipe.countDocuments();
        if (count > 0) {
            console.log('Data already exists. Skipping insertion.');
            // You can uncomment the line below to delete existing data before inserting
            // await Recipe.deleteMany({});
        } else {
            console.log(`Inserting ${recipes.length} recipe documents...`);
            await Recipe.insertMany(recipes);
            console.log('Data inserted successfully!');
        }
    } catch (error) {
        console.error('Error with database operation:', error);
    } finally {
        // Always disconnect from the database when the script is done.
        mongoose.disconnect();
    }
}

// Step 5: Call the function to start the process.
insertRecipes();