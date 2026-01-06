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
    cover: "/images/networks-main-cover.jpeg",
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
    cover: "/images/cat-programming-cover-big.jpg",
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
    cover: "/images/thumbnails/cybersec-cover-1.jpeg",
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
    cover: "/images/database-cover-course-main.jpg",
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
    cover: "/images/thumbnails/web-dev-main.jpg",
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
    cover: "/images/thumbnails/cat-ai-cover.jpeg",
  },

  
];
module.exports = CATEGORIES;