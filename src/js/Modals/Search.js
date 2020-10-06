import axios from "axios";
import {proxy} from '../Config'
class Search {
  constructor(query) {
    this.query = query;
  }

  async getSearchResults() {
 
    //   fetch(`${cors}https://recipesapi.herokuapp.com/api/search?q=${query}`)
    //     .then((res) => res.json())
    //     .then((res) => console.log(res));

    try {
      const res = await axios.get(
        `${proxy}https://recipesapi.herokuapp.com/api/search?q=${this.query}`
      );
      this.result = res.data.recipes;
         
    } catch (err) {
      console.log(err);
    }
  }
}

export default Search;
