import { elements } from "./base";

export const getInput = () => elements.getInput.value;
export const clearInput = () => {
  elements.getInput.value = "";
};
export const clearResultsList = () => {
  elements.resultList.innerHTML = "";
  elements.searchResPages.innerHTML = "";
};

export const highlightSelected = (id) => {
  const resultsArr = Array.from(document.querySelectorAll(".results__link"));
  resultsArr.forEach((el) => {
    el.classList.remove("results__link--active");
  });
  document
    .querySelector(`.results__link[href*="${id}"]`)
    .classList.add("results__link--active");
};

export function limitRecipeTitle(title, limit = 17) {
  if (title.length > limit) {
    const newTitleArr = [];
    let newTitle = title.split(" ");
    newTitle.reduce((acc, curr) => {
      if (acc + curr.length < limit) {
        newTitleArr.push(curr);
      }
      return acc + curr.length;
    }, 0);
    return newTitleArr.join(" ") + "...";
  } else {
    return title;
  }
}

const createButton = (page, type) => {
  return `
 <button class="btn-inline results__btn--${type}" data-goto=${
    type === "prev" ? page - 1 : page + 1
  }>
     <svg class="search__icon">
         <use href="img/icons.svg#icon-triangle-${
           type === "prev" ? "left" : "right"
         }"></use>
     </svg>
     <span>Page  ${type === "prev" ? page - 1 : page + 1}</span>
 </button> 
 `;
};

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);

  let button;
  if (page === 1 && pages > 1) {
    // buttom to go to netxt page
    button = createButton(page, "next");
  } else if (page < pages) {
    //both button
    button = `
${createButton(page, "prev")}      ${createButton(page, "next")}
    
    `;
  } else if (page === pages && pages > 1) {
    // only button to go to prev page
    button = createButton(page, "prev");
  }

  if (button !== undefined) {
    elements.searchResPages.insertAdjacentHTML("afterbegin", button);
  }
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  if (recipes.length > 0) {
    recipes.slice(start, end).forEach((data) => {
      const markup = `<li>
    <a class="results__link" href="#${data.recipe_id}">
        <figure class="results__fig">
            <img src="${data.image_url}" alt="Test">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(data.title)}</h4>
            <p class="results__author">
            ${data.publisher}</p>
        </div>
    </a>
</li>`;

      elements.resultList.insertAdjacentHTML("beforeend", markup);
    });
  } else {
    let el = `<div class="error">Recipes not found</div>
   `;
    elements.resultList.insertAdjacentHTML("beforeend", el);
  }
  renderButtons(page, recipes.length, resPerPage);
};
