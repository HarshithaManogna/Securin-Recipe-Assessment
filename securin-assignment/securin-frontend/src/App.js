import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Rating from 'react-rating-stars-component';
import {
  Drawer,
  Grid,
  Card,
  Button,
  Pagination,
  TextField,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Fade,
  Divider,
} from '@mui/material';
import { MdOutlineExpandMore, MdOutlineExpandLess } from 'react-icons/md';
import { IoSearchOutline, IoCloseOutline } from 'react-icons/io5';
import { Refresh } from '@mui/icons-material';

// --- Reusable Recipe Card Component ---
const RecipeCard = ({ recipe, onClick }) => (
  <Card className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden relative">
    <div className="p-6">
      <Typography variant="h6" className="font-garamond text-gray-900 font-semibold mb-2 leading-tight line-clamp-2">
        {recipe.title}
      </Typography>
      <Chip
        label={recipe.cuisine}
        className="text-sm font-montserrat text-gray-600 border-gray-300 capitalize"
        variant="outlined"
        size="small"
      />
      <div className="flex justify-between items-center my-4">
        <div className="flex items-center">
          {recipe.rating ? (
            <Rating
              count={5}
              value={recipe.rating}
              size={20}
              edit={false}
              isHalf={true}
              activeColor="#f59e0b"
            />
          ) : (
            <Typography variant="body2" className="font-montserrat text-gray-500">N/A</Typography>
          )}
        </div>
        <Typography variant="body2" className="font-montserrat text-gray-600">
          ({recipe.rating?.toFixed(1) ?? 'N/A'})
        </Typography>
      </div>
      <Divider className="my-2" />
      <div className="flex justify-between text-sm font-montserrat text-gray-600 mt-4">
        <div>
          <span className="font-medium text-gray-800">Time:</span> {recipe.total_time ? `${recipe.total_time} min` : 'N/A'}
        </div>
        <div>
          <span className="font-medium text-gray-800">Serves:</span> {recipe.serves}
        </div>
      </div>
    </div>
    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-end justify-center pb-4">
      <Button
        onClick={onClick}
        variant="contained"
        className="normal-case opacity-0 hover:opacity-100 transition-opacity duration-300 transform hover:-translate-y-2"
        sx={{ backgroundColor: '#217346', '&:hover': { backgroundColor: '#185634' } }}
      >
        View Details
      </Button>
    </div>
  </Card>
);

// --- Recipe Detail Drawer Component ---
const RecipeDetailDrawer = ({ open, recipe, onClose }) => {
  const [expanded, setExpanded] = useState(false);
  const nutrientMap = {
    'calories': 'Calories', 'carbohydrateContent': 'Carbohydrates', 'cholesterolContent': 'Cholesterol',
    'fiberContent': 'Fiber', 'proteinContent': 'Protein', 'saturatedFatContent': 'Saturated Fat',
    'sodiumContent': 'Sodium', 'sugarContent': 'Sugar', 'fatContent': 'Fat',
  };

  if (!recipe) return null;

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className="p-10 max-w-xl w-screen bg-white min-h-full">
        <div className="flex justify-end mb-4">
          <IconButton onClick={onClose} size="small" className="text-gray-500 hover:text-gray-900">
            <IoCloseOutline size={24} />
          </IconButton>
        </div>
        <div className="mb-6">
          <Typography variant="h4" className="font-garamond text-gray-900 font-bold">{recipe.title}</Typography>
          <Typography variant="subtitle1" className="font-montserrat text-gray-600">{recipe.cuisine}</Typography>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-6">
          <Typography variant="h6" className="font-montserrat font-semibold text-gray-800 mb-2">Description</Typography>
          <Typography variant="body1" className="font-montserrat text-gray-700">{recipe.description || 'No description available.'}</Typography>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-6">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
            <Typography variant="h6" className="font-montserrat font-semibold text-gray-800">
              Cooking Time
            </Typography>
            <IconButton>{expanded ? <MdOutlineExpandLess size={24} /> : <MdOutlineExpandMore size={24} />}</IconButton>
          </div>
          <Collapse in={expanded}>
            <div className="mt-4 font-montserrat text-gray-700">
              <Typography variant="body1">
                <span className="font-medium text-gray-800">Total:</span> {recipe.total_time ? `${recipe.total_time} min` : 'N/A'}
              </Typography>
              <Typography variant="body1">
                <span className="font-medium text-gray-800">Prep:</span> {recipe.prep_time ? `${recipe.prep_time} min` : 'N/A'}
              </Typography>
              <Typography variant="body1">
                <span className="font-medium text-gray-800">Cook:</span> {recipe.cook_time ? `${recipe.cook_time} min` : 'N/A'}
              </Typography>
            </div>
          </Collapse>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
          <Typography variant="h6" className="font-montserrat font-semibold text-gray-800 mb-4">Nutritional Information</Typography>
          <Grid container spacing={2}>
            {recipe.nutrients && Object.entries(recipe.nutrients).map(([key, value]) => (
              <Grid item xs={6} key={key}>
                <Typography variant="body2" className="font-montserrat text-gray-600 font-medium">
                  {nutrientMap[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Typography>
                <Typography variant="body1" className="font-montserrat text-gray-800">{value || 'N/A'}</Typography>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </Drawer>
  );
};

// --- Main App Component ---
const RecipeApp = () => {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // We define the fetch function here to resolve dependency warnings.
    const performFetch = async () => {
        try {
            if (isSearching) {
                const response = await axios.get(`http://localhost:5000/api/recipes/search?title=${searchQuery}`);
                setRecipes(response.data.data);
                setTotal(response.data.data.length);
            } else {
                const response = await axios.get(`http://localhost:5000/api/recipes?page=${page}&limit=${limit}`);
                setRecipes(response.data.data);
                setTotal(response.data.total);
            }
        } catch (error) {
            console.error('Error fetching recipes:', error);
            setRecipes([]);
        }
    };
    performFetch();
  }, [page, limit, isSearching, searchQuery]);

  const handleSearchClick = () => {
    setPage(1);
    setIsSearching(true);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setPage(1);
    setIsSearching(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen font-montserrat">
      <header className="bg-white text-gray-800 shadow-md py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-garamond font-bold tracking-wide">Recipe Journal</h1>
          <p className="mt-2 text-lg text-gray-600">A collection of culinary inspiration</p>
        </div>
      </header>
      <main className="container mx-auto p-8">
        <div className="bg-white p-8 rounded-lg shadow-xl mb-10">
          <Typography variant="h5" className="font-garamond font-bold text-gray-800 mb-6 text-center">
            Search for your next dish
          </Typography>
          <div className="flex flex-col md:flex-row gap-4">
            <TextField
              fullWidth
              label="Search by recipe title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearchClick(); }}
              variant="outlined"
              size="small"
              className="flex-grow"
            />
            <Button
              onClick={handleSearchClick}
              variant="contained"
              startIcon={<IoSearchOutline />}
              sx={{ backgroundColor: '#217346', '&:hover': { backgroundColor: '#185634' }, whiteSpace: 'nowrap' }}
            >
              Search
            </Button>
            <Button
              onClick={handleClearFilters}
              variant="outlined"
              startIcon={<Refresh />}
              sx={{ borderColor: '#217346', color: '#217346', '&:hover': { borderColor: '#185634', color: '#185634' }, whiteSpace: 'nowrap' }}
            >
              All Recipes
            </Button>
          </div>
        </div>
        
        {recipes.length > 0 ? (
          <Fade in={true} timeout={500}>
            <Grid container spacing={4}>
              {recipes.map((recipe) => (
                <Grid item xs={12} sm={6} md={4} key={recipe._id}>
                  <RecipeCard recipe={recipe} onClick={() => setSelectedRecipe(recipe)} />
                </Grid>
              ))}
            </Grid>
          </Fade>
        ) : (
          <div className="flex justify-center items-center h-64">
            <Typography variant="h5" color="textSecondary" className="text-gray-500 font-garamond">
              {isSearching ? 'No results found. Try a different search.' : 'No recipes available. Please check your API connection.'}
            </Typography>
          </div>
        )}

        {!isSearching && recipes.length > 0 && (
          <div className="flex justify-center items-center mt-10">
            <Pagination
              count={Math.ceil(total / limit)}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
              size="large"
            />
            <div className="ml-4 flex items-center">
              <Typography className="mr-2 text-gray-700">Results per page:</Typography>
              <select
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
                className="border p-2 rounded-md border-gray-300"
              >
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        )}
      </main>
      <RecipeDetailDrawer
        open={!!selectedRecipe}
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
    </div>
  );
};

export default RecipeApp;
