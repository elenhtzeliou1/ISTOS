// Global application bootstrap
// This file initializes all UI modules and page-specific logic
// after the DOM has fully loaded.
// Each module is defensive (checks for required DOM elements),
// so calling all init() methods here is safe across pages.

document.addEventListener("DOMContentLoaded", () => {
  // ----- Core layout & global UI -----
  window.Layout?.init?.();          // Navigation bar & footer injection
  window.Modals?.init?.();          // Global modal handling
  window.CategoryUtils?.init?.();   // Shared category helpers (if present)
  window.ResponsiveUI?.init?.();    // Responsive behavior helpers
  window.RevealUI?.init?.();        // Scroll-based reveal animations
  window.CourseItemsReveal?.init?.(); // Course card reveal animations

  // ----- Filters (shared across list pages) -----
  window.FilterUI?.init?.();        // Sidebar filters (open/close, collapse)

  // ----- Categories pages -----
  window.CategoriesPage?.init?.();  // index.html & categories.html logic
  window.GoalSliderHeight?.init?.(".goal-slider"); // Header ring slider height sync

  // ----- Listing pages -----
  window.CoursesPage?.init?.();     // courses.html filtering & rendering
  window.BooksPage?.init?.();       // books.html filtering & rendering
  window.VideosPage?.init?.();      // videos.html filtering & rendering

  // ----- Details pages -----
  window.BookDetailsPage?.init?.();     // book-details.html
  window.CourseDetailsPage?.init?.();   // course-details.html
  window.VideoDetailsPage?.init?.();    // video-details.html
  window.CourseDetailResponsive?.init?.(); // Course header carousel (categories.html)

  // ----- Homepage featured content -----
  window.PreferedBooksPage?.init?.();    // Featured books (index.html)
  window.PreferedVideosPage?.init?.();   // Featured videos (index.html)
  window.ProposedCoursesPage?.init?.();  // Featured courses data

  // ----- Carousels & sliders -----
  window.ProposedCoursesCarousel?.init?.(); // Drag-based proposed courses carousel
  window.IntroSlider?.init?.();              // Homepage intro slider
  window.CardCarouselDrag?.init?.();         // Generic draggable card sliders

  // ----- UI widgets -----
  window.AccordionUI?.init?.();      // Accordions (FAQs, categories, etc.)

  // ----- Forms -----
  window.RegisterForm?.init?.();     // Register / profile form logic
});
