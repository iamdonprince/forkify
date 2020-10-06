//  https://recipesapi.herokuapp.com/api/search
// https://recipesapi.herokuapp.com/api/search?q=chicken&page=3
// https://recipesapi.herokuapp.com/api/get

import Search from "./Modals/Search";
import * as SearchView from "./Views/SearchView";
import * as RecipeView from "./Views/Recipesview";
import * as ListView from "./Views/ListView";
import * as LikesView from "./Views/LikesView";
import { elements, renderLoader, clearLoader } from "./Views/base";
import Recipes from "./Modals/Recipes";
import List from "./Modals/List";
import Likes from "./Modals/Likes";
//global state
const state = {};

/*  search controller

*/
const controllerSearch = async () => {
  //get query
  const query = SearchView.getInput();
  if (query) {
    state.search = new Search(query);

    // prepared ui  for search
    SearchView.clearInput();
    SearchView.clearResultsList();
    renderLoader(elements.searchRes);
    try {
      await state.search.getSearchResults();

      //   render result to UI
      clearLoader();
      SearchView.renderResults(state.search.result);
    } catch (error) {
      console.log(error);
      clearLoader();
    }
  }
  //search for recipesapi
};

elements.searchBtn.addEventListener("submit", (e) => {
  e.preventDefault();
  controllerSearch();
});

elements.searchResPages.addEventListener("click", (e) => {
  let btn = e.target.closest(".btn-inline");

  if (btn) {
    let goto = parseInt(btn.dataset.goto, 10);
    SearchView.clearResultsList();
    SearchView.renderResults(state.search.result, goto);
  }
});

/*
recipes controller

*/

const controllerRecipe = async () => {
  const id = window.location.hash.replace("#", "");
  console.log(id);

  if (id) {
    // Prepare UI for changes
    RecipeView.clearRecipe();
    renderLoader(elements.Recipe);
    if (state.search) SearchView.highlightSelected(id);
    // Create new recipe
    state.recipe = new Recipes(id);
    try {
      await state.recipe.getRecipes();
      state.recipe.parseIngredients();
      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      // Render recipe
      clearLoader();
      RecipeView.renderRecipe(state.recipe, state.like.isLiked(id));
    } catch (error) {
      console.log(error);
    }
  }
  // Get recipe data
};

// window.addEventListener('hashchange', controllerRecipe)
// window.addEventListener('load', controllerRecipe)

["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controllerRecipe)
);
/*
 List 
 Controller

*/

const controlList = () => {
  if (!state.list) {
    state.list = new List();
  }

  ListView.clearList();

  state.recipe.ingredients.forEach((el) => {
    let items = state.list.addItem(el.count, el.unit, el.ingredient);
    ListView.renderItem(items);
  });
};

// handle delete update method

elements.shopping.addEventListener("click", (e) => {
  let id = e.target.closest(".shopping__item").dataset.itemid;
  // handle delete method

  if (e.target.matches(".shopping__delete,.shopping__delete *")) {
    state.list.deleteItem(id);
    ListView.deleteItem(id);
  } else if (e.target.matches(".shopping__count_value")) {
    let val = e.target.value;
    state.list.updateItem(id, val);
  }
});
/* 
control liked
*/

const controlLike = () => {
  if (!state.like) state.like = new Likes();
  const currentID = state.recipe.id;

  if (!state.like.isLiked(currentID)) {
    // addd like to state
    const lk = state.like.addLikes(
      state.recipe.id,
      state.recipe.title,
      state.recipe.pub,
      state.recipe.imageUrl
    );

    // toggle like button
    LikesView.toggleLikeBtn(true);
    //render To UI
    LikesView.renderLike(lk);
  } else {
    // romove from state

    state.like.deleteLike(currentID);

    // toggle  like button
    LikesView.toggleLikeBtn(false);
    // remove from ui
    LikesView.deleteLike(currentID);
  }
  LikesView.toggleLikesMenu(state.like.numberOfLikes());
};

// Restore liked recipes on page load
window.addEventListener("load", () => {
  state.like = new Likes();
  // Restore likes
  state.like.readStorage();

  // Toggle like menu button
  LikesView.toggleLikesMenu(state.like.numberOfLikes());

  // Render the existing likes
  state.like.Likes.forEach((like) => LikesView.renderLike(like));
});

//recipe elements adding events

elements.Recipe.addEventListener("click", (e) => {
  // console.log(e.target.matches(".btn-decrease,.btn-decrease *"))
  // let btnDec = e.target.closest(".btn-decrease");
  if (e.target.matches(".btn-decrease,.btn-decrease *")) {
    if (state.recipe.calcServings > 1) {
      state.recipe.updateServings("dec");
      RecipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    state.recipe.updateServings("inc");
    RecipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn_add,.recipe__btn_add *")) {
    // shopping add button
    controlList();
  } else if (e.target.matches(".recipe__love,.recipe__love *")) {
    // like event

    controlLike();
  }
});
