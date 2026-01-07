// Featured / recommended books
// Used on:
// - index.html (homepage preview)
// - books.html (highlighted books section)
// Responsible for selecting featured books and rendering compact cards

(function () {
  // Utility: limits text length by number of words (used for short descriptions)
  function sliceWords(text, maxWords = 26) {
    const words = String(text || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length <= maxWords) return words.join(" ");
    return words.slice(0, maxWords).join(" ") + "…";
  }

  function init() {
    // Wrapper that holds the featured book cards
    const prefered_books_wrapper = document.getElementById("prefered-books-wrapper");
    if (!prefered_books_wrapper) return;

    // Ensure BOOKS dataset is available
    if (typeof BOOKS === "undefined") {
      console.error("BOOKS data missing. Did you load assets/js/data/books.js? Check again!");
      return;
    }

    // Pick up to 4 featured books
    let prefered = BOOKS.filter((b) => b.featured).slice(0, 4);

    // Render featured book cards
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

  // Public API
  window.PreferedBooksPage = { init };
})();
