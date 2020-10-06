import { elements } from "./base";
import { Fraction } from "fractional";

export const clearRecipe = () => {
  elements.Recipe.innerHTML = "";
};

const formateCount = (count) => {
  if (count) {
    // count = 2.5 --> 2 1/2
    // count = 0.5 --> 1 1/2

    const newCount = Math.round(count * 10000) / 10000;
    const [int, dec] = count
      .toString()
      .split(".")
      .map((el) => parseInt(el, 10));

    if (!dec) return newCount;

    if (int === 0) {
      const fr = new Fraction(newCount);
      return `${fr.numerator}/${fr.denominator}`;
    } else {
      const fr = new Fraction(newCount - int);
      return `${int} ${fr.numerator}/${fr.denominator}`;
    }
  }
  return "?";
};

const createElement = (el) => {
  return `
    <li class="recipe__item">
    <svg class="recipe__icon">
        <use href="img/icons.svg#icon-check"></use>
    </svg>
    <div class="recipe__count">${formateCount(el.count)}</div>
    <div class="recipe__ingredient">
        <span class="recipe__unit">${el.unit}</span>
        ${el.ingredient}
    </div>
</li>

    
    `;
};

export const renderRecipe = (recipe, isLiked) => {
  let markup = `
   <figure class="recipe__fig">
   <img src=${recipe.imageUrl} alt=${recipe.title} class="recipe__img">
   <h1 class="recipe__title">
       <span>${recipe.title}</span>
   </h1>
</figure>
<div class="recipe__details">
   <div class="recipe__info">
       <svg class="recipe__info-icon">
           <use href="img/icons.svg#icon-stopwatch"></use>
       </svg>
       <span class="recipe__info-data recipe__info-data--minutes">${
         recipe.time
       }</span>
       <span class="recipe__info-text"> minutes</span>
   </div>
   <div class="recipe__info">
       <svg class="recipe__info-icon">
           <use href="img/icons.svg#icon-man"></use>
       </svg>
       <span class="recipe__info-data recipe__info-data--people">${
         recipe.calcServings
       }</span>
       <span class="recipe__info-text"> servings</span>

       <div class="recipe__info-buttons">
           <button class="btn-tiny btn-decrease">
               <svg>
                   <use href="img/icons.svg#icon-circle-with-minus"></use>
               </svg>
           </button>
           <button class="btn-tiny btn-increase">
               <svg>
                   <use href="img/icons.svg#icon-circle-with-plus"></use>
               </svg>
           </button>
       </div>

   </div>
   <button class="recipe__love">
       <svg class="header__likes">
           <use href="img/icons.svg#icon-heart${
             isLiked ? "" : "-outlined"
           }"></use>
       </svg>
   </button>
</div>



<div class="recipe__ingredients">
   <ul class="recipe__ingredient-list">
${recipe.ingredients.map((el) => createElement(el)).join("")}
       
   </ul>

   <button class="btn-small recipe__btn recipe__btn_add">
       <svg class="search__icon">
           <use href="img/icons.svg#icon-shopping-cart"></use>
       </svg>
       <span>Add to shopping list</span>
   </button>
</div>

<div class="recipe__directions">
   <h2 class="heading-2">How to cook it</h2>
   <p class="recipe__directions-text">
       This recipe was carefully designed and tested by
       <span class="recipe__by">The Pioneer Woman</span>. Please check out directions at their website.
   </p>
   <a class="btn-small recipe__btn" href=${recipe.url}>
       <span>Directions</span>
       <svg class="search__icon">
           <use href="img/icons.svg#icon-triangle-right"></use>
       </svg>

   </a>
</div>

   
   `;

  elements.Recipe.insertAdjacentHTML("afterbegin", markup);
};

export const updateServingsIngredients = (recipe) => {
  // Update servings
  document.querySelector(".recipe__info-data--people").textContent =
    recipe.calcServings;

  // Update ingredeints
  const countElements = Array.from(document.querySelectorAll(".recipe__count"));
  countElements.forEach((el, i) => {
    el.textContent = formateCount(recipe.ingredients[i].count);
  });
};
