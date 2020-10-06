export const elements = {
  getInput: document.querySelector(".search__field"),
  searchBtn: document.querySelector(".search"),
  searchRes: document.querySelector(".results"),
  resultList: document.querySelector(".results__list"),
  resultsPages: document.querySelector(".results__pages"),
  searchResPages: document.querySelector(".results__pages"),
  Recipes: document.querySelector(".results__link"),
  Recipe: document.querySelector(".recipe"),
  shopping: document.querySelector(".shopping__list"),
  likesMenu: document.querySelector(".likes__field"),
  likesList: document.querySelector(".likes__list"),
};

export const renderLoader = (parent) => {
  const loader = `
      <div class="loader">
     <svg>

     <use href="img/icons.svg#icon-cw"></use>

     </svg>
     </div>
     `;

  parent.insertAdjacentHTML("afterbegin", loader);
};

export const clearLoader = () => {
  const loader = document.querySelector(".loader");
  if (loader) loader.parentElement.removeChild(loader);
};
