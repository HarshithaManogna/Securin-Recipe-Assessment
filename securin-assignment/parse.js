const fs = require('fs');
const path = require('path');

// Step A: Define the path to your JSON file.
const filePath = path.join(__dirname, 'US_recipes.json');

// Step B: Read the file content as a simple text string.
// We use `readFileSync` to read the entire file.
const rawDataString = fs.readFileSync(filePath, 'utf8');

// Step C: Replace the "NaN" strings with the valid JSON keyword "null".
const correctedDataString = rawDataString.replace(/NaN/g, 'null');

// Step D: Now, parse the corrected string into a JavaScript object.
// `JSON.parse` will now work without errors.
const recipes = JSON.parse(correctedDataString);

// Step E: Loop through each recipe to confirm the data and print a message.
Object.values(recipes).forEach(recipe => {
    // This loop is no longer needed to fix NaN, but it's good for other checks if you need them later.
});

// Step F: Print a message to let us know the process is complete.
console.log("JSON parsing and NaN value handling is complete!");

// You can also print the first recipe to see the result.
console.log("Here is the first recipe after processing:");
console.log(Object.values(recipes)[0]);