document.addEventListener("DOMContentLoaded", function(){

    const nav = document.querySelector("nav");
    const menuBtn = document.getElementById("openMenu");



    menuBtn.addEventListener("click", function(){
        nav.classList.toggle("mobile-open");
        menuBtn.classList.toggle("active");
        document.body.classList.toggle("no-scroll");
    });


});