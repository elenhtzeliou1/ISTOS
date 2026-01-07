/**
 * videos.js
 * ----------
 * Static dataset of educational videos linked to the platform.
 *
 * Purpose:
 * - Used to populate the videos listing page
 * - Supports category and difficulty-based filtering
 * - Each video links to an external YouTube resource
 *
 * Fields:
 * - youtubeUrl is used for embedding or redirection
 * - featured controls homepage visibility
 */
const VIDEOS = [
  {
    id: 1,
    title: "Learn Python in Less than 10 Minutes for Beginners (Fast & Easy)",
    category: "programming",
    difficulty: "beginner",
    featured: true,
    description:
      "A fast, clear introduction to Python syntax, variables, data types, and simple I/O. Great as a first step before starting an intro course.",
    cover: "assets/images/thumbnails/cover-18.jpg",
    available: true,
    youtubeUrl: "https://www.youtube.com/watch?v=fWjsdhR3z3c",
  },
  {
    id: 2,
    title: "Learn Python for loops in 5 minutes!",
    category: "programming",
    difficulty: "beginner",
    featured: true,
    description:
      "Learn if/else, for, and while with practical mini-problems. Includes common mistakes and how to avoid them.",
    cover: "assets/images/thumbnails/cover-17.jpg",
    available: true,
    youtubeUrl: "https://www.youtube.com/watch?v=KWgYha0clzw",
  },
  {
    id: 3,
    title: "Functions and Clean Code",
    category: "programming",
    difficulty: "intermediate",
    featured: true,
    description:
      "Understand parameters, return values, scope, and how to structure code into reusable blocks. A bridge between beginner and advanced Python.",
    cover: "assets/images/thumbnails/cover-28.jpg",
    available: true,
    youtubeUrl: "https://www.youtube.com/watch?v=mvgTQAVRpKA",
  },
  {
    id: 4,
    title: "How the Internet Works (TCP/IP Explained)",
    category: "networks",
    difficulty: "beginner",
    featured: false,
    description:
      "A visual explanation of the TCP/IP model, packets, routing, DNS, and what happens when you load a webpage.",
    cover: "assets/images/thumbnails/networks-cover-4.jpg",
    available: true,
    youtubeUrl: "https://www.youtube.com/watch?v=PpsEaqJV_A0",
  },
  {
    id: 5,
    title: "Cybersecurity: Common Attacks You Must Know",
    category: "cybersecurity",
    difficulty: "beginner",
    featured: false,
    description:
      "Covers phishing, malware, password attacks, and social engineering with real-world examples and simple prevention tips.",
    cover: "assets/images/thumbnails/cybersec-cover-2-small.jpg",
    available: true,
    youtubeUrl: "https://www.youtube.com/watch?v=Dk-ZqQ-bfy4",
  },
  {
    id: 6,
    title: "SQL Joins Made Simple",
    category: "databases",
    difficulty: "intermediate",
    featured: false,
    description:
      "A step-by-step guide to INNER, LEFT, RIGHT, and FULL joins with diagrams and query patterns used in real database tasks.",
    cover: "assets/images/thumbnails/cover-21.jpg",
    available: true,
    youtubeUrl: "https://www.youtube.com/watch?v=Yh4CrPHVBdE",
  },
  {
    id: 7,
    title: "AI, Machine Learning, Deep Learning and Generative AI Explained",
    category: "ai",
    difficulty: "beginner",
    featured: true,
    description:
      "Learn what machine learning is, how models learn from data, and the difference between training and prediction. A friendly starting point before diving into algorithms.",
    cover: "assets/images/thumbnails/igor-omilaev-eGGFZ5X2LnA-unsplash.jpg",
    available: true,
    youtubeUrl: "https://www.youtube.com/watch?v=qYNweeDHiyU",
  },
  {
    id: 8,
    title: "Learn CSS in 20 Minutes",
    category: "web-development",
    difficulty: "beginner",
    featured: true,
    description:
       "A fast introduction to CSS fundamentals—selectors, the box model, flexbox, and responsive styling—so you can start building clean layouts with confidence.",
    cover: "assets/images/thumbnails/cover-2.jpg",
    available: true,
    youtubeUrl: "https://www.youtube.com/watch?v=1PnVor36_40",
  },
];

/**
 * Attach dataset to global scope
 */
window.VIDEOS = VIDEOS;