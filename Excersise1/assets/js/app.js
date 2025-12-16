document.addEventListener("DOMContentLoaded", () => {

  window.Layout?.init?.();
  window.CategoryUtils?.init?.();

  window.ResponsiveUI?.init?.();
  window.RevealUI?.init?.();

  window.CourseItemsReveal?.init?.();

  window.FilterUI?.init?.();

  window.CategoriesPage?.init?.();
  window.GoalSliderHeight?.init?.(".goal-slider");

  window.CoursesPage?.init?.();
  window.BooksPage?.init?.();
  window.VideosPage?.init?.();


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

  window.Modals?.init?.();
  window.RegisterForm?.init?.();
});
