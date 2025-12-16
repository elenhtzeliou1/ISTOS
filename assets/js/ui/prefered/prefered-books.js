// ta proteinomena vivlia pou fainontai sto index.html kai sto books.html
(function () {
  function sliceWords(text, maxWords = 26) {
    const words = String(text || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length <= maxWords) return words.join(" ");
    return words.slice(0, maxWords).join(" ") + "…";
  }

  function init() {
    const prefered_books_wrapper = document.getElementById("prefered-books-wrapper");
    if (!prefered_books_wrapper) return;

    if (typeof BOOKS === "undefined") {
      console.error("BOOKS data missing. Did you load assets/js/data/books.js? Check again!");
      return;
    }

    let prefered = BOOKS.filter((b) => b.featured).slice(0, 4);

    prefered_books_wrapper.innerHTML = prefered
      .map((book) => {
        const desc = sliceWords(book.description, 26);

        return `
          <a class="card" href="book-details.html?id=${encodeURIComponent(book.id)}">
            <div class="card-info">
              <div class="tag-row">
                <div class="tag">${book.category}</div>
                <div class="tag">${book.difficulty}</div>
              </div>
              <h2>${book.title}</h2>
              <p>${desc}</p>
            </div>

            <div class="card-img-cont">
              <img src="${book.cover}" alt="${book.title}" />
            </div>
          </a>
        `;
      })
      .join("");
  }

  window.PreferedBooksPage = { init };
})();
