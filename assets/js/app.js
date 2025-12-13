document.addEventListener("DOMContentLoaded", () => {
  // COMMON
  window.Layout?.init?.();
  window.CategoryUtils?.init?.();

  window.ResponsiveUI?.init?.();
  window.RevealUI?.init?.();

  window.CourseItemsReveal?.init?.();

  window.FilterUI?.init?.();

  // PAGES (lists)
  window.CategoriesPage?.init?.();
  window.CoursesPage?.init?.();
  window.BooksPage?.init?.();
  window.VideosPage?.init?.();

  // DETAILS
  window.BookDetailsPage?.init?.();
  window.CourseDetailsPage?.init?.();
  window.VideoDetailsPage?.init?.();
  window.CourseDetailResponsive?.init?.();

  window.PreferedBooksPage?.init?.();
  window.PreferedVideosPage?.init?.();
  window.ProposedCoursesPage?.init?.();

  window.ProposedCoursesCarousel?.init?.();
  window.IntroSlider?.init?.();
  window.CardCarouselDrag?.init?.();
  window.AccordionUI?.init?.();

  window.RegisterForm?.init?.();
});
