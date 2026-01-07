// Book details page logic
// Wrapped in an IIFE to keep variables scoped and avoid global pollution
(function () {
  function init() {
    // Ensure books data is available before proceeding
    if (typeof BOOKS === "undefined") {
      console.error("Books data is missing! Check books.js path!");
      return;
    }

    // Parse query parameters from the current URL
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get("id");

    // Abort if no book id is provided in the URL
    if (!bookId) {
      console.warn("No book id found in URL!");
      return;
    }

    // Find the matching book (supports both numeric and string ids)
    const book = BOOKS.find((b) => String(b.id) === String(bookId));

    // Abort if no matching book is found
    if (!book) {
      console.warn("No book found for id: ", bookId);
      return;
    }

    // Cache DOM elements used to display book information
    const coverImgBook = document.getElementById("book-cover");
    const titleBook = document.getElementById("book-title");
    const categoryBook = document.getElementById("book-category");
    const authorBook = document.getElementById("book-author");
    const availabilityBook = document.getElementById("book-availability");
    const difficultyBook = document.getElementById("book-difficulty");
    const descriptionBook = document.getElementById("book-description");

    if(titleBook) titleBook.textContent = book.title;
    if(categoryBook) categoryBook.textContent = book.category;
    if(authorBook) authorBook.textContent = book.author;
    if(availabilityBook){
        availabilityBook.textContent = book.available ? "Available" : "Currently Unavailable";
        availabilityBook.classList.toggle("available", !!book.available);
        availabilityBook.classList.toggle("unavailable", !book.available);
    }

    // Display difficulty level if provided
    if (difficultyBook) {
      difficultyBook.textContent = book.difficulty || "";
    }

    // Handle book cover image and fallback alt text
    if (coverImgBook) {
      if (book.cover) {
        coverImgBook.src = book.cover;
        coverImgBook.alt = `${book.title} cover`;
      } else {
        coverImgBook.alt = `${book.title} cover not available`;
      }
    }

    // Set book description content
    if (descriptionBook) descriptionBook.textContent = book.description;
  }

  // Expose page initializer
  window.BookDetailsPage = { init };
})();
