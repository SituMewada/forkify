import {
  state,
  loadRecipe,
  loadSearchResults,
  getSearchResultsPage,
  updateServings,
  addBookmark,
  uploadRecipe,
} from './model.js';
import recipeView from './views/recipeView.js';
import 'core-js/stable';
import resultView from './views/resultView.js';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';
import searchView from './views/searchView.js';
import paginationView from './views/paginationView.js';
const recipeContainer = document.querySelector('.recipe');
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// https://forkify-api.herokuapp.com/v2

/////////////////////////////////////////
if (module.hot) {
  module.hot.accept();
}
const controlRecipes = async function (e) {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    //0) Update result view to mark selected search result
    resultView.update(getSearchResultsPage());

    // 1. Loading Recipe
    await loadRecipe(id);

    //2. Rendring the recipe
    recipeView.render(state.recipe);

    // const recipeView=new RecipeView(state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};
const controlSearchResult = async function () {
  try {
    resultView.renderSpinner();
    // 1) get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) load search result
    await loadSearchResults(query);

    //3)rendring the result
    resultView.render(getSearchResultsPage(3));

    //Rendring initial pagination Buttons
    paginationView.render(state.search);
  } catch (err) {
    throw err;
  }
};
const controlPagination = function (goToPage) {
  //Rendring NEW the result
  resultView.render(getSearchResultsPage(goToPage));

  //Rendring NEW pagination Buttons
  paginationView.render(state.search);
};

const controlServings = function (newServing) {
  //Updating the recipe serving (in state)
  updateServings(newServing);

  //Updating the recipe  view
  // recipeView.render(state.recipe);
  recipeView.update(state.recipe);
};
const controlAddBookmark = function () {
  addBookmark(state.recipe);
  resultView.update(state.recipe);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();
    await uploadRecipe(newRecipe);
    //Upload the new recipe data
    console.log(state.recipe);
    //Render the window
    recipeView.render(state.recipe);
    //Success message
    addRecipeView.renderMessage();
    //Close the window
    setTimeout(() => {
      // addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log('💥', err);
    addRecipeView.renderError(err.message);
  }
};
//controlServings();
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResult);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
