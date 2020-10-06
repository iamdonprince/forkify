export default class Likes {
  constructor() {
    this.Likes = [];
  }

  addLikes(id, title, author, img) {
    const like = { id, title, author, img };
    this.Likes.push(like);

    // Perist data in localStorage
    this.persistData();
    return like;
  }

  deleteLike(id) {
    let index = this.Likes.findIndex((el) => el.id === id);

    this.Likes.splice(index, 1);

    // Perist data in localStorage
    this.persistData();
  }

  isLiked(id) {
    return this.Likes.findIndex((el) => el.id === id) !== -1;
  }

  numberOfLikes() {
    return this.Likes.length;
  }
  persistData() {
    localStorage.setItem("likes", JSON.stringify(this.Likes));
  }

  readStorage() {
    const storage = JSON.parse(localStorage.getItem("likes"));

    // Restoring likes from the localStorage
    if (storage) this.Likes = storage;
  }
}
