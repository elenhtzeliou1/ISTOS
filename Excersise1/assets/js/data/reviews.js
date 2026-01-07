/**
 * reviews.js
 * ----------
 * Stores user-generated reviews for courses.
 *
 * Purpose:
 * - Used to render reviews and average ratings on course detail pages
 * - Demonstrates relational data (courseId → reviews)
 *
 * Notes:
 * - In Part A, reviews are static
 * - In Part B, this structure is replaced by MongoDB documents
 */
const REVIEWS = [
  {
    courseId: "python-intro",
    userId: 1,
    userName: "Kalliopi Haska",
    rating: 4,
    comment: "I find the course very helpful—well done!",
    createdAt: "2025-12-02T10:15:00Z",
  },
  {
    courseId: "python-intro",
    userId: 2,
    userName: "Giorgos Papadopoulos",
    rating: 5,
    comment: "Clear explanations and great beginner pace. Loved the exercises.",
    createdAt: "2025-12-05T18:40:00Z",
  },
  {
    courseId: "python-intro",
    userId: 3,
    userName: "Maria Konstantinou",
    rating: 3,
    comment: "Good overall, but I would like a bit more practice on functions.",
    createdAt: "2025-12-07T09:05:00Z",
  },
  {
    courseId: "python-intro",
    userId: 4,
    userName: "Nikos Georgiou",
    rating: 4,
    comment: "Nice structure. The lessons are short and easy to follow.",
    createdAt: "2025-12-10T21:12:00Z",
  },

  {
    courseId: "python-advanced",
    userId: 2,
    userName: "Giorgos Papadopoulos",
    rating: 5,
    comment:
      "Solid deep dive into more advanced topics—especially the practice tasks.",
    createdAt: "2025-12-04T18:40:00Z",
  },
  {
    courseId: "networks-fundamentals",
    userId: 3,
    userName: "Maria Konstantinou",
    rating: 4,
    comment:
      "Clear explanation of OSI/TCP-IP and core networking concepts. Good pacing.",
    createdAt: "2025-12-06T09:05:00Z",
  },
  {
    courseId: "network-troubleshooting",
    userId: 4,
    userName: "Nikos Georgiou",
    rating: 4,
    comment:
      "Practical troubleshooting mindset + realistic scenarios. Very useful for labs.",
    createdAt: "2025-12-08T21:12:00Z",
  },
  {
    courseId: "cybersecurity-essentials",
    userId: 5,
    userName: "Eleni Tzeliou",
    rating: 5,
    comment:
      "Good coverage of threats and basic defenses without being overwhelming.",
    createdAt: "2025-12-10T14:22:00Z",
  },
  {
    courseId: "secure-coding",
    userId: 6,
    userName: "Dimitris Chatzis",
    rating: 5,
    comment:
      "Loved the secure coding tips—especially input validation and common web mistakes.",
    createdAt: "2025-12-11T12:10:00Z",
  },
  {
    courseId: "sql-databases",
    userId: 7,
    userName: "Sofia Markou",
    rating: 4,
    comment: "Nice SQL fundamentals with examples you can reuse in assignments.",
    createdAt: "2025-12-12T17:30:00Z",
  },
  {
    courseId: "db-design",
    userId: 8,
    userName: "Petros Kotsis",
    rating: 4,
    comment:
      "Great overview of normalization and schema thinking. Helped my ER modeling.",
    createdAt: "2025-12-13T11:05:00Z",
  },
  {
    courseId: "javascript-dom",
    userId: 9,
    userName: "Anna Papalexi",
    rating: 4,
    comment: "DOM manipulation finally makes sense. Small exercises are on point.",
    createdAt: "2025-12-14T20:45:00Z",
  },
  {
    courseId: "ai-fundamentals-lab",
    userId: 10,
    userName: "Christos Lykos",
    rating: 3,
    comment:
      "Interesting intro to AI concepts. I’d love a bit more hands-on practice.",
    createdAt: "2025-12-15T08:55:00Z",
  },
  {
    courseId: "prompting-and-ai-tools",
    userId: 11,
    userName: "Despina Ioannou",
    rating: 5,
    comment:
      "Super practical—prompt patterns I can use immediately for studying and projects.",
    createdAt: "2025-12-16T16:20:00Z",
  },


];

/**
 * Make reviews accessible to UI scripts
 */
window.REVIEWS = REVIEWS;
