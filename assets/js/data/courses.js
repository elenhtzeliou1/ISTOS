const COURSES = [
  {
    id: "python-intro",
    title: "Introduction to Python",
    category: "programming",
    difficulty: "beginner",
    available: true,
    featured: true,
    cover: "assets/images/thumbnails/python-course-thumb-nail.jpeg",
    description:
      "Learn the fundamentals of Python, one of the most popular programming languages today. This course covers variables, data types, loops, functions, and basic problem-solving techniques. Ideal for absolute beginners looking to enter the world of coding with a friendly and powerful language.",
    learningGoals: [
      {
        title: "Understand Python basics",
        text: "Understand basic programming concepts using Python.",
      },
      {
        title: "Write simple scripts",
        text: "Write simple scripts using variables, conditions and loops.",
      },
      {
        title: "Reuse your code",
        text: "Organize code into reusable functions for cleaner programs.",
      },
    ],
    sections: [
      {
        title: "Getting Started with Python",
        summary:
          "Installation, first steps with the interpreter and writing your first script.",
      },
      {
        title: "Working with Data",
        summary:
          "Numbers, strings, lists and dictionaries in everyday problems.",
      },
      {
        title: "Control Flow & Functions",
        summary: "Conditions, loops and defining your own functions.",
      },
    ],
    questions: [
      {
        question: "Do I need prior experience?",
        answer:
          "No, this course is designed for absolute beginners with no programming background.",
      },
      {
        question: "How much time should I plan?",
        answer:
          "Around 3–4 hours per week for 3–4 weeks is usually enough to follow comfortably.",
      },
    ],
  },

  {
    id: "python-advanced",
    title: "Advanced Python",
    category: "programming",
    difficulty: "advanced",
    available: false,
    featured: true,
    cover: "assets/images/thumbnails/data-analytics-cover.jpeg",
    description:
      "Go beyond the basics and master advanced Python concepts including decorators, generators, object-oriented programming, memory management, and performance optimization. This course is designed for learners who already understand the core Python syntax and want to write production-level, scalable applications.",
    learningGoals: [
      {
        title: "Use advanced features",
        text: "Use advanced Python features like decorators, generators and context managers.",
      },
      {
        title: "Design with OOP",
        text: "Design applications using object-oriented patterns and clean abstractions.",
      },
      {
        title: "Optimize performance",
        text: "Improve performance and memory usage of Python programs.",
      },
      {
        title: "Write production code",
        text: "Write more maintainable, production-ready Python code.",
      },
    ],
    sections: [
      {
        title: "Advanced Language Features",
        summary:
          "Decorators, generators, context managers and idiomatic Python.",
      },
      {
        title: "Object-Oriented Design",
        summary:
          "Classes, inheritance, composition and design patterns in practice.",
      },
      {
        title: "Performance & Optimization",
        summary:
          "Profiling, understanding memory usage and improving execution speed.",
      },
    ],
    questions: [
      {
        question: "Who is this course for?",
        answer:
          "Learners who are already comfortable with basic Python syntax and want to go deeper.",
      },
      {
        question: "Is this course very time-demanding?",
        answer:
          "You should expect a bit more effort: 4–6 hours per week, plus optional exercises.",
      },
    ],
  },

  {
    id: "networks-fundamentals",
    title: "Computer Networks",
    category: "networks",
    difficulty: "intermediate",
    available: true,
    featured: true,
    cover: "assets/images/thumbnails/networks-main-cover.jpeg",
    description:
      "Understand how computers communicate across modern networks. Explore network layers, routing principles, TCP/IP, DNS, and protocols that power the internet. Includes practical examples, visual explanations, and insights into how data travels securely and efficiently between systems.",
    learningGoals: [
      {
        title: "See the big picture",
        text: "Understand the basic architecture of computer networks.",
      },
      {
        title: "Follow the data path",
        text: "Explain how data is encapsulated and transmitted across layers.",
      },
      {
        title: "Know key protocols",
        text: "Recognize common network protocols such as TCP, UDP, HTTP and DNS.",
      },
      {
        title: "Build a strong base",
        text: "Build a solid foundation for more advanced networking or security courses.",
      },
    ],
    sections: [
      {
        title: "Networking Basics",
        summary: "Key concepts, terminology and why networks matter.",
      },
      {
        title: "The TCP/IP Model",
        summary:
          "Layers, addressing, routing and how data moves through the stack.",
      },
      {
        title: "Protocols in Practice",
        summary: "HTTP, DNS and everyday examples of network communication.",
      },
    ],
    questions: [
      {
        question: "What will I learn by the end?",
        answer:
          "You’ll understand how the internet works at a conceptual level and be able to read and discuss basic network diagrams.",
      },
      {
        question: "Is there any math involved?",
        answer:
          "Only light math (like understanding binary and IP addresses) – nothing beyond basic high-school level.",
      },
    ],
  },

  {
    id: "cybersecurity-essentials",
    title: "Cybersecurity Essentials",
    category: "security",
    difficulty: "intermediate",
    available: true,
    featured: true,
    cover: "assets/images/thumbnails/main-networks-course.jpeg",
    description:
      "A comprehensive introduction to the core principles of cybersecurity. Learn about attack types, encryption fundamentals, authentication mechanisms, secure communication, and best practices for protecting systems. Perfect for learners aiming to build strong security awareness and foundational skills.",
    learningGoals: [
      {
        title: "Spot common threats",
        text: "Recognize common cyber threats and attack types.",
      },
      {
        title: "Learn core concepts",
        text: "Understand basic concepts of encryption and authentication.",
      },
      {
        title: "Protect your systems",
        text: "Apply simple best practices to protect systems and data.",
      },
      {
        title: "Prepare for more",
        text: "Build a foundation for more specialized security topics.",
      },
    ],
    sections: [
      {
        title: "Threats & Attacks",
        summary:
          "Malware, phishing, social engineering and common attack vectors.",
      },
      {
        title: "Security Fundamentals",
        summary:
          "CIA triad, risk, vulnerabilities and basic security controls.",
      },
      {
        title: "Protecting Systems",
        summary:
          "Passwords, multi-factor authentication, secure communication basics.",
      },
    ],
    questions: [
      {
        question: "What’s the main goal of this course?",
        answer:
          "To give you a practical understanding of core cybersecurity concepts and how to apply them in everyday scenarios.",
      },
      {
        question: "Will I learn practical skills?",
        answer:
          "Yes, you’ll see concrete examples and checklists you can apply immediately to improve your own security posture.",
      },
    ],
  },

  {
    id: "sql-databases",
    title: "Databases with SQL",
    category: "databases",
    difficulty: "beginner",
    available: true,
    featured: true,
    cover: "assets/images/thumbnails/course-cover5.jpeg",
    description:
      "Learn how to store, organize, and query data using SQL — the standard language for relational databases. This course covers table design, relationships, CRUD operations, joins, filtering, and real-world query examples. A practical introduction for anyone working with data in modern applications.",
    learningGoals: [
      {
        title: "Understand relational DBs",
        text: "Understand what relational databases are and when to use them.",
      },
      {
        title: "Design simple schemas",
        text: "Design simple tables and relationships between them.",
      },
      {
        title: "Write core SQL",
        text: "Write basic SQL queries for inserting, updating and deleting data.",
      },
      {
        title: "Ask questions with data",
        text: "Use SELECT with filtering and joins to answer real questions with data.",
      },
    ],
    sections: [
      {
        title: "Relational Database Basics",
        summary: "Tables, rows, columns and how data is organized.",
      },
      {
        title: "Core SQL Operations",
        summary: "INSERT, UPDATE, DELETE and working with primary keys.",
      },
      {
        title: "Querying & Joins",
        summary: "SELECT, WHERE, ORDER BY and combining data across tables.",
      },
    ],
    questions: [
      {
        question: "What kind of databases are used?",
        answer:
          "We use a standard relational database (π.χ. PostgreSQL ή MySQL) ώστε οι γνώσεις να μεταφέρονται εύκολα παντού.",
      },
      {
        question: "Do I need to know programming?",
        answer:
          "Όχι απαραίτητα. Η βασική λογική είναι δηλωτική, αρκεί να μπορείς να σκέφτεσαι με όρους πινάκων και δεδομένων.",
      },
    ],
  },

  {
    id: "java-first-steps",
    title: "Java: First Steps",
    category: "programming",
    difficulty: "beginner",
    available: true,
    featured: false,
    cover: "assets/images/des.avif",
    description:
      "Get started with Java fundamentals. Learn variables, control flow, methods, basic OOP, and how to build small console programs. Great for students who want a strong typed-language foundation.",
    learningGoals: [
      {
        title: "Understand Java syntax",
        text: "Write basic Java code confidently.",
      },
      {
        title: "Practice OOP basics",
        text: "Use classes, objects, and methods in simple examples.",
      },
      {
        title: "Build mini programs",
        text: "Create small console apps to reinforce logic.",
      },
    ],
    sections: [
      {
        title: "Java Setup & Basics",
        summary: "JDK, IDE, variables, types, operators.",
      },
      {
        title: "Control Flow",
        summary: "if/else, loops, basic problem solving.",
      },
      { title: "Intro to OOP", summary: "Classes, objects, fields, methods." },
    ],
    questions: [
      {
        question: "Is this beginner-friendly?",
        answer: "Yes, no prior Java experience is needed.",
      },
      {
        question: "Will this help with university labs?",
        answer: "Yes, it matches typical first-year programming content.",
      },
    ],
  },

  {
    id: "data-structures-python",
    title: "Data Structures with Python",
    category: "programming",
    difficulty: "intermediate",
    available: true,
    featured: true,
    cover: "assets/images/courses/python-intro.jpg",
    description:
      "Strengthen problem-solving by working with lists, stacks, queues, trees, and hash-based structures using Python. Includes algorithmic thinking and small coding challenges.",
    learningGoals: [
      {
        title: "Use core structures",
        text: "Work confidently with common data structures.",
      },
      {
        title: "Improve logic",
        text: "Choose the right structure for each problem.",
      },
      {
        title: "Prepare for algorithms",
        text: "Build foundations for more advanced CS topics.",
      },
    ],
    sections: [
      {
        title: "Linear Structures",
        summary: "Lists, stacks, queues and use cases.",
      },
      {
        title: "Hashing & Dictionaries",
        summary: "Fast lookups and real examples.",
      },
      {
        title: "Trees & Intro Graphs",
        summary: "Conceptual + beginner-friendly implementations.",
      },
    ],
    questions: [
      {
        question: "Do I need Python basics?",
        answer: "Yes, you should know variables, functions, and loops.",
      },
      {
        question: "Is this useful for algorithms courses?",
        answer:
          "Definitely. It gives you the practical base needed for sorting, searching, and complexity topics.",
      },
    ],
  },

  {
    id: "networking-basics",
    title: "Networking Basics",
    category: "networks",
    difficulty: "beginner",
    available: true,
    featured: false,
    cover: "assets/images/networks.avif",
    description:
      "A gentle start to networking concepts: IP addresses, ports, LAN vs WAN, basic devices, and real-world examples. Ideal before diving into TCP/IP details.",
    learningGoals: [
      {
        title: "Understand core terms",
        text: "Learn essential networking vocabulary.",
      },
      {
        title: "Read simple diagrams",
        text: "Recognize how devices connect in small networks.",
      },
      {
        title: "Build confidence",
        text: "Prepare for intermediate networking courses.",
      },
    ],
    sections: [
      {
        title: "What is a Network?",
        summary: "Types of networks and why they matter.",
      },
      {
        title: "Addressing Basics",
        summary: "IP, MAC, ports, and simple routing ideas.",
      },
      { title: "Common Devices", summary: "Routers, switches, access points." },
    ],
    questions: [
      {
        question: "Is this too basic?",
        answer: "It’s meant as a bridge for absolute beginners.",
      },
      {
        question: "Will I configure real devices?",
        answer:
          "You’ll focus mainly on concepts and simple tools first, then move to more practical labs later.",
      },
    ],
  },

  {
    id: "network-troubleshooting",
    title: "Network Troubleshooting Lab",
    category: "networks",
    difficulty: "intermediate",
    available: true,
    featured: true,
    cover: "assets/images/networks.avif",
    description:
      "Hands-on troubleshooting mindset with tools like ping, traceroute, nslookup, and basic Wi-Fi diagnostics. Focused on real scenarios students face in labs.",
    learningGoals: [
      {
        title: "Use key tools",
        text: "Practice debugging connectivity issues.",
      },
      {
        title: "Think systematically",
        text: "Follow structured troubleshooting steps.",
      },
      {
        title: "Handle real cases",
        text: "Diagnose common LAN/Wi-Fi problems.",
      },
    ],
    sections: [
      { title: "Toolbox", summary: "ping, traceroute, DNS checks." },
      {
        title: "Typical Failures",
        summary: "IP conflicts, gateway issues, DNS misconfigurations.",
      },
      {
        title: "Wi-Fi Basics",
        summary: "Signal, interference, security settings.",
      },
    ],
    questions: [
      {
        question: "Is this a theory or practice course?",
        answer:
          "It’s practice-focused. You’ll learn methods and apply them to realistic network problems.",
      },
      {
        question: "Do I need prior networking knowledge?",
        answer:
          "Basic familiarity with IP and DNS helps, but the early modules refresh the essentials.",
      },
    ],
  },

  {
    id: "security-basics",
    title: "Cybersecurity Basics",
    category: "security",
    difficulty: "beginner",
    available: true,
    featured: false,
    cover: "assets/images/cybersec.avif",
    description:
      "Start with practical security awareness: safe passwords, phishing recognition, basic encryption concepts, and everyday defense strategies.",
    learningGoals: [
      { title: "Recognize threats", text: "Identify common attacks quickly." },
      {
        title: "Apply safe habits",
        text: "Use practical security best practices.",
      },
      {
        title: "Understand fundamentals",
        text: "Build a base for deeper security topics.",
      },
    ],
    sections: [
      {
        title: "Threat Landscape",
        summary: "Phishing, malware, social engineering.",
      },
      {
        title: "Authentication",
        summary: "Passwords, MFA, secure access habits.",
      },
      {
        title: "Basic Crypto Concepts",
        summary: "What encryption does (and doesn’t) do.",
      },
    ],
    questions: [
      {
        question: "Is this suitable for non-technical learners?",
        answer:
          "Yes. The course focuses on practical understanding and everyday security behavior.",
      },
      {
        question: "Will this help me protect my own devices?",
        answer:
          "Absolutely. You’ll gain checklists and habits you can apply immediately.",
      },
    ],
  },

  {
    id: "secure-coding",
    title: "Secure Coding Fundamentals",
    category: "security",
    difficulty: "intermediate",
    available: true,
    featured: true,
    cover: "assets/images/cybersec.avif",
    description:
      "Learn how to write safer code by understanding common vulnerabilities such as injection, insecure authentication, and poor input validation.",
    learningGoals: [
      {
        title: "Avoid common bugs",
        text: "Understand typical security pitfalls in code.",
      },
      {
        title: "Validate inputs",
        text: "Use safe patterns for input handling.",
      },
      {
        title: "Think like a defender",
        text: "Connect programming decisions with security outcomes.",
      },
    ],
    sections: [
      {
        title: "Risk in Code",
        summary: "Why small mistakes become big vulnerabilities.",
      },
      {
        title: "Input & Validation",
        summary: "Sanitization and safe data flows.",
      },
      {
        title: "Auth & Sessions",
        summary: "Safer login and session concepts.",
      },
    ],
    questions: [
      {
        question: "Do I need web development knowledge?",
        answer:
          "It helps, but examples are explained step-by-step with security context.",
      },
      {
        question: "Is this about ethical hacking?",
        answer:
          "It’s more defensive than offensive — focused on writing code that resists attacks.",
      },
    ],
  },

  {
    id: "db-design",
    title: "Database Design Essentials",
    category: "databases",
    difficulty: "intermediate",
    available: true,
    featured: true,
    cover: "assets/images/databases.png",
    description:
      "Move beyond queries and learn how to model data properly. Covers normalization, relationships, schema design, and real-use cases from web applications.",
    learningGoals: [
      {
        title: "Model clean schemas",
        text: "Design tables with clear relationships.",
      },
      {
        title: "Understand normalization",
        text: "Reduce redundancy and improve integrity.",
      },
      {
        title: "Build for real apps",
        text: "Connect design choices to app performance.",
      },
    ],
    sections: [
      {
        title: "Modeling Data",
        summary: "Entities, relationships, cardinality.",
      },
      { title: "Normalization", summary: "1NF to 3NF with real examples." },
      {
        title: "Schema in Practice",
        summary: "Patterns for typical applications.",
      },
    ],
    questions: [
      {
        question: "Do I need to know SQL first?",
        answer:
          "Basic SQL helps, but the focus here is design logic rather than heavy querying.",
      },
      {
        question: "Will this help with ER diagrams?",
        answer:
          "Yes. You’ll practice interpreting and building ER-style models that translate into clean schemas.",
      },
    ],
  },

  {
    id: "sql-advanced",
    title: "Advanced SQL Queries",
    category: "databases",
    difficulty: "advanced",
    available: true,
    featured: false,
    cover: "assets/images/databases.png",
    description:
      "Master advanced querying with window functions, CTEs, performance-aware joins, and complex reporting patterns used in real analytics scenarios.",
    learningGoals: [
      {
        title: "Write advanced reports",
        text: "Use CTEs and window functions confidently.",
      },
      {
        title: "Optimize thinking",
        text: "Understand query cost and structure.",
      },
      {
        title: "Level up analytics",
        text: "Build skills useful for data-heavy projects.",
      },
    ],
    sections: [
      {
        title: "CTEs & Subqueries",
        summary: "Readable, powerful query structures.",
      },
      {
        title: "Window Functions",
        summary: "Ranking, partitioning, moving metrics.",
      },
      {
        title: "Performance Patterns",
        summary: "Smarter joins and filtering.",
      },
    ],
    questions: [
      {
        question: "Is this for data analytics or backend dev?",
        answer:
          "Both. The techniques are valuable for reporting, dashboards, and performance-critical applications.",
      },
      {
        question: "Do you cover indexing?",
        answer:
          "You’ll get a practical introduction to performance thinking, including when indexing matters conceptually.",
      },
    ],
  },

  {
    id: "html-css-foundations",
    title: "HTML & CSS Foundations",
    category: "web-development",
    difficulty: "beginner",
    available: true,
    featured: true,
    cover: "assets/images/photo-1550751827-4bd374c3f58b.avif",
    description:
      "Learn modern HTML structure and responsive CSS layouts. Includes flexbox, grid basics, and small page-building exercises.",
    learningGoals: [
      {
        title: "Build layouts",
        text: "Create clean page structure with semantic HTML.",
      },
      {
        title: "Style confidently",
        text: "Use modern CSS patterns for responsive UI.",
      },
      {
        title: "Ship small pages",
        text: "Complete mini-projects to solidify skills.",
      },
    ],
    sections: [
      {
        title: "Semantic HTML",
        summary: "Clean structure and accessibility basics.",
      },
      { title: "Modern CSS", summary: "Flexbox, grid, spacing systems." },
      { title: "Responsive Design", summary: "Mobile-first layout thinking." },
    ],
    questions: [
      {
        question: "Do I need any design background?",
        answer:
          "No. You’ll learn layout and structure from scratch with practical examples.",
      },
      {
        question: "Will I build real pages?",
        answer:
          "Yes, small responsive pages that can be used in your portfolio.",
      },
    ],
  },

  {
    id: "javascript-dom",
    title: "JavaScript & the DOM",
    category: "web-development",
    difficulty: "intermediate",
    available: true,
    featured: false,
    cover: "assets/images/des.avif",
    description:
      "Make websites interactive by mastering events, DOM manipulation, basic state patterns, and browser APIs.",
    learningGoals: [
      {
        title: "Manipulate UI",
        text: "Update elements dynamically and safely.",
      },
      {
        title: "Handle events",
        text: "Build interactive flows with clean event logic.",
      },
      {
        title: "Prepare for apps",
        text: "Get ready for larger front-end projects.",
      },
    ],
    sections: [
      {
        title: "DOM Foundations",
        summary: "Selectors, nodes, creating elements.",
      },
      { title: "Events", summary: "Click, input, delegation patterns." },
      {
        title: "Browser APIs",
        summary: "LocalStorage and simple async patterns.",
      },
    ],
    questions: [
      {
        question: "Do I need to know HTML/CSS first?",
        answer:
          "Yes, basic familiarity helps because you’ll manipulate real elements and layouts.",
      },
      {
        question: "Will this prepare me for frameworks?",
        answer:
          "Yes. Understanding DOM and state concepts makes React/Vue much easier later.",
      },
    ],
  },

  {
    id: "exam-prep-hub",
    title: "Exam Prep Hub",
    category: "ai",
    difficulty: "beginner",
    available: true,
    featured: true,
    cover: "assets/images/vid.avif",
    description:
      "Structured revision plans and topic checklists across programming, networks, security, and databases. Designed for fast, focused exam preparation.",
    learningGoals: [
      {
        title: "Plan smart revisions",
        text: "Use weekly templates and checklists.",
      },
      { title: "Boost confidence", text: "Practice with guided mini quizzes." },
      {
        title: "See cross-topic links",
        text: "Understand how categories connect.",
      },
    ],
    sections: [
      { title: "Revision Templates", summary: "Ready-to-use weekly plans." },
      { title: "Core Checklists", summary: "Must-know concepts per category." },
      { title: "Mini Quizzes", summary: "Fast recall practice." },
    ],
    questions: [
      {
        question: "Is this a real course or a toolkit?",
        answer:
          "It’s a structured toolkit with short guidance modules and ready-to-use study resources.",
      },
      {
        question: "Can I use it for multiple subjects?",
        answer:
          "Yes, it’s designed to support cross-topic revision in Informatics.",
      },
    ],
  },

  {
    id: "mini-projects",
    title: "Mini Projects Collection",
    category: "ai",
    difficulty: "intermediate",
    available: true,
    featured: false,
    cover: "assets/images/vid.avif",
    description:
      "A guided set of short projects that combine multiple topics. Build small portfolio pieces and reinforce theory with practice.",
    learningGoals: [
      {
        title: "Apply what you learn",
        text: "Turn theory into working artifacts.",
      },
      {
        title: "Combine categories",
        text: "Blend programming with DB/network/security basics.",
      },
      {
        title: "Build portfolio",
        text: "Create small but meaningful projects.",
      },
    ],
    sections: [
      {
        title: "Project Starters",
        summary: "Clear requirements and starter ideas.",
      },
      { title: "Integration Tasks", summary: "Small multi-topic challenges." },
      { title: "Presentation Tips", summary: "How to document your work." },
    ],
    questions: [
      {
        question: "Do these projects require a team?",
        answer:
          "No, they’re designed to be achievable individually, with optional extensions for group work.",
      },
      {
        question: "What level should I be?",
        answer:
          "You should be comfortable with basics in at least one area (e.g., programming or SQL).",
      },
    ],
  },
];
