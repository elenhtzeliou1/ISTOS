document.addEventListener("DOMContentLoaded",()=>{
    if(typeof BOOKS === "undefined"){
        console.error("Books data is missing! Check books.js path!");
        return;
    }


    const params = new URLSearchParams(window.location.search);
    const bookId = params.get("id");

    if (!bookId){
        console.warn("No book id found in URL!");
        return;
    }

    //to parakato doulevei kai gia int id kai gia string id
    const book = BOOKS.find((b)=> String(b.id) === String(bookId));



    if(!book){
        console.warn("No book found for id: ", bookId);
        return;   
    }

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
    if (difficultyBook) {
        difficultyBook.textContent = book.difficulty || "";
    }

    if (coverImgBook){
        if (book.cover){
            coverImgBook.src = book.cover;
            coverImgBook.alt = `${book.title} cover`;
        }else{
            coverImgBook.alt = `${book.title} cover not available`
        }
    }

    if (descriptionBook) descriptionBook.textContent = book.description;


});