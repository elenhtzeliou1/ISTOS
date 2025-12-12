(function () {
  function init() {
    const prefered_books_wrapper = document.getElementById(
      "prefered-books-wrapper"
    );
    if (!prefered_books_wrapper) return;

    if (typeof BOOKS === "undefined") {
      console.error(
        "BOOKS data missing. Did you load assets/js/data/books.js? Check again!"
      );
      return;
    }

    let prefered = BOOKS.filter((b) => b.featured);

    // keep only the first 4
    prefered = prefered.slice(0, 4);

    // render them:
    prefered_books_wrapper.innerHTML = prefered
      .map(
        (book) => `
      <a class="card" href="book-details.html?id=${encodeURIComponent(
        book.id
      )}">
        <div class="card-info">
          <div class="tag-row">
            <div class="tag">${book.category}</div>
            <div class="tag">${book.difficulty}</div>
          </div>
          <h2>${book.title}</h2>
          <p>${book.description}</p>
        </div>

        <div class="card-img-cont">
          <img src="${book.cover}" alt="${book.title}" />
        </div>
      </a>
    `
      )
      .join("");
  }

  window.PreferedBooksPage = { init };
})();
