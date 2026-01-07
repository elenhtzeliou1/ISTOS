/**
 * categories.js
 * --------------
 * Defines the main learning categories of the platform.
 *
 * Purpose:
 * - Used to render category landing pages
 * - Powers course/book filtering by category
 * - Provides descriptive metadata for UI sections
 *
 * Structure:
 * - Each category includes labels and informational bullet points
 * - `slug` is used as a stable identifier across the application
 */
const CATEGORIES = [
  {
    id: 1,
    title: "Networks",
    slug: "networks",
    description:
      "Learn how devices communicate across local and global networks. Topics include IP addressing, routing, switching, protocols, and troubleshooting fundamentals to help you understand real-world connectivity.",
    label_list: [
      { label: "Routing" },
      { label: "Protocols" },
      { label: "Infrastructure" },
    ],
    info_list: [
      { info: "Understand OSI & TCP/IP models" },
      { info: "Learn core protocols (HTTP, DNS, TCP/UDP)" },
      { info: "Practice with ping & traceroute" },
      { info: "Explore routing & switching basics" },
      { info: "Build strong networking foundations" },
    ],
    cover: "assets/images/networks-main-cover.jpeg",
  },

  {
    id: 2,
    title: "Programming",
    slug: "programming",
    description:
      "Build strong coding foundations through structured lessons and practice. Learn problem-solving, algorithms, and real-world programming patterns using beginner-friendly languages and projects.",
    label_list: [
      { label: "Algorithms" },
      { label: "Problem Solving" },
      { label: "Code Practice" },
    ],
    info_list: [
      { info: "Start with fundamentals and syntax" },
      { info: "Work through guided exercises" },
      { info: "Understand functions, loops, and OOP" },
      { info: "Build small portfolio projects" },
      { info: "Progress from beginner to advanced" },
    ],
    cover: "assets/images/cat-programming-cover-big.jpg",
  },

  {
    id: 3,
    title: "Cybersecurity",
    slug: "cybersecurity",
    description:
      "Explore core cybersecurity concepts including authentication, encryption, network defense, and safe system design. Learn how attacks work and how modern systems protect data and users.",
    label_list: [
      { label: "Defense" },
      { label: "Threats" },
      { label: "Encryption" },
    ],
    info_list: [
      { info: "Understand common attack types" },
      { info: "Learn secure authentication practices" },
      { info: "Explore encryption fundamentals" },
      { info: "Connect security with networks & code" },
      { info: "Build a security-first mindset" },
    ],
    cover: "assets/images/thumbnails/cybersec-cover-1.jpeg",
  },

  {
    id: 4,
    title: "Databases & SQL",
    slug: "databases",
    description:
      "Learn how data is stored, structured, and queried. Practice SQL, explore relational design, and understand how databases support real applications and analytics workflows.",
    label_list: [
      { label: "SQL" },
      { label: "Design" },
      { label: "Data Modeling" },
    ],
    info_list: [
      { info: "Write SELECT, JOIN, GROUP BY queries" },
      { info: "Understand keys & relationships" },
      { info: "Design clean relational schemas" },
      { info: "Work with realistic datasets" },
      { info: "Connect databases to apps" },
    ],
    cover: "assets/images/database-cover-course-main.jpg",
  },

  {
    id: 5,
    title: "Web & Application Development",
    slug: "web-development",
    description:
      "Build modern web applications by combining front-end and back-end skills. Learn HTML, CSS, JavaScript, APIs, and basic deployment with clear, practical structure.",
    label_list: [
      { label: "Frontend" },
      { label: "Backend" },
      { label: "APIs" },
    ],
    info_list: [
      { info: "Learn modern HTML/CSS layouts" },
      { info: "Build interactive UI with JavaScript" },
      { info: "Understand client-server flow" },
      { info: "Work with REST APIs" },
      { info: "Practice basic deployment concepts" },
    ],
    cover: "assets/images/thumbnails/web-dev-main.jpg",
  },

  {
    id: 6,
    title: "Artificial Intelligence",
    slug: "ai",
    description:
      "Turn theory into practice with guided projects, quizzes, templates, and structured study resources. Ideal for revision, exams, and building confidence across all Informatics topics.",
    label_list: [
      { label: "Projects" },
      { label: "Quizzes" },
      { label: "Templates" },
    ],
    info_list: [
      { info: "Use checklists and study plans" },
      { info: "Practice with mini-projects" },
      { info: "Review key concepts efficiently" },
      { info: "Combine topics into applied tasks" },
      { info: "Build portfolio-ready work" },
    ],
    cover: "assets/images/thumbnails/cat-ai-cover.jpeg",
  },

  
];

/**
 * Make categories globally accessible
 */
window.CATEGORIES = CATEGORIES;