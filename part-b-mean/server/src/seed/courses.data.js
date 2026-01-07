const COURSES = [

  {
    id: "python-intro",
    title: "Introduction to Python",
    category: "programming",
    difficulty: "beginner",
    available: true,
    featured: true,
    cover: "/images/thumbnails/python-course-thumb-nail-big.jpeg",
    description:
      "Learn the fundamentals of Python, one of the most popular programming languages today. This course covers variables, data types, loops, functions, and basic problem-solving techniques. Ideal for absolute beginners looking to enter the world of coding with a friendly and powerful language.",
    learningGoals: [
      {
        title: "Understand Python basics",
        text: "Learn core syntax and how Python code is structured.",
      },
      {
        title: "Write simple scripts",
        text: "Use variables, conditions, and loops to solve small problems.",
      },
      {
        title: "Reuse your code",
        text: "Organize logic into functions so programs stay clean and readable.",
      },
      {
        title: "Build confidence",
        text: "Practice with mini tasks that feel like real coding.",
      },
    ],
    sections: [
      {
        id: "py-01",
        title: "Getting Started with Python",
        summary:
          "Installation, first steps with the interpreter and writing your first script.",
        lessons: [
          {
            id: "py-01-01",
            title: "Course intro + setup",
            summary: "Install Python, choose an editor, run your first script.",
            minutes: 15,
          },
          {
            id: "py-01-02",
            title: "Hello World + output",
            summary: "print(), strings, and simple output formatting.",
            minutes: 20,
          },
          {
            id: "py-01-03",
            title: "Variables & types",
            summary: "Numbers, strings, booleans and naming rules.",
            minutes: 30,
          },
        ],
      },
      {
        id: "py-02",
        title: "Working with Data",
        summary:
          "Numbers, strings, lists and dictionaries in everyday problems.",
        lessons: [
          {
            id: "py-02-01",
            title: "Lists",
            summary: "Indexing, slicing, append and looping over lists.",
            minutes: 35,
          },
          {
            id: "py-02-02",
            title: "Dictionaries",
            summary: "Key-value storage, lookup, update, iterate.",
            minutes: 35,
          },
          {
            id: "py-02-03",
            title: "Mini practice",
            summary: "Short tasks combining lists + dicts.",
            minutes: 25,
          },
        ],
      },
      {
        id: "py-03",
        title: "Control Flow & Functions",
        summary:
          "Make decisions, repeat actions, and package logic into reusable functions.",
        lessons: [
          {
            id: "py-03-01",
            title: "If / elif / else",
            summary: "Write conditions and handle multiple cases clearly.",
            minutes: 25,
          },
          {
            id: "py-03-02",
            title: "Loops in practice",
            summary: "for/while patterns, counters, and simple validations.",
            minutes: 35,
          },
          {
            id: "py-03-03",
            title: "Functions",
            summary: "Parameters, return values, and clean structure.",
            minutes: 35,
          },
        ],
      },
    ],
    questions: [
      {
        question: "Do I need prior experience?",
        answer: "No. It’s designed for absolute beginners.",
      },
      {
        question: "How much time should I plan?",
        answer: "Around 3–4 hours per week for 3–4 weeks is comfortable.",
      },
    ],
    recommended: {
      books: [
        {
          id: 1,
          reason:
            "Beginner-friendly explanations + practice that matches this course.",
        },
        {
          id: 7,
          reason:
            "Great for mini-project ideas and automation practice after basics.",
        },
      ],
      videos: [
        { id: 1, reason: "Quick visual recap for the first steps and syntax." },
        {
          id: 2,
          reason: "Extra practice on loops, conditions, and functions.",
        },
      ],
    },
  },

  {
    id: "python-advanced",
    title: "Advanced Python",
    category: "programming",
    difficulty: "advanced",
    available: true,
    featured: true,
    cover: "/images/thumbnails/main-image-9.jpeg",
    description:
      "Go beyond the basics and master advanced Python concepts including decorators, generators, object-oriented programming, memory management, and performance optimization.",
    learningGoals: [
      {
        title: "Use advanced features",
        text: "Decorators, generators, and context managers confidently.",
      },
      {
        title: "Design with OOP",
        text: "Build cleaner abstractions with classes and patterns.",
      },
      {
        title: "Optimize performance",
        text: "Profiling mindset + common optimization techniques.",
      },
      {
        title: "Write production code",
        text: "Structure code for readability and maintainability.",
      },
    ],
    sections: [
      {
        id: "pyA-01",
        title: "Advanced Language Features",
        summary:
          "Decorators, generators, context managers and idiomatic Python.",
        lessons: [
          {
            id: "pyA-01-01",
            title: "Iterators & generators",
            summary: "Lazy evaluation and efficient loops.",
            minutes: 35,
          },
          {
            id: "pyA-01-02",
            title: "Decorators",
            summary: "Wrap behavior and build reusable tooling.",
            minutes: 40,
          },
          {
            id: "pyA-01-03",
            title: "Context managers",
            summary: "with-statement patterns and resource safety.",
            minutes: 30,
          },
        ],
      },
      {
        id: "pyA-02",
        title: "Object-Oriented Design",
        summary: "Classes, composition, and patterns you actually use.",
        lessons: [
          {
            id: "pyA-02-01",
            title: "Designing classes",
            summary: "Responsibilities, cohesion, and clean APIs.",
            minutes: 35,
          },
          {
            id: "pyA-02-02",
            title: "Composition vs inheritance",
            summary: "When to use each and why.",
            minutes: 35,
          },
          {
            id: "pyA-02-03",
            title: "Pythonic patterns",
            summary: "dataclasses, properties, and readable design.",
            minutes: 35,
          },
        ],
      },
      {
        id: "pyA-03",
        title: "Performance & Optimization",
        summary: "Profiling basics and performance-aware coding.",
        lessons: [
          {
            id: "pyA-03-01",
            title: "Profiling mindset",
            summary: "Measure first: where time really goes.",
            minutes: 25,
          },
          {
            id: "pyA-03-02",
            title: "Common bottlenecks",
            summary: "Loops, allocations, data structures.",
            minutes: 35,
          },
          {
            id: "pyA-03-03",
            title: "Practical optimization",
            summary: "Small changes with big impact.",
            minutes: 35,
          },
        ],
      },
    ],
    questions: [
      {
        question: "Who is this course for?",
        answer: "People comfortable with Python basics who want to level up.",
      },
      {
        question: "Is this time-demanding?",
        answer: "Expect ~4–6 hours/week + optional practice.",
      },
    ],
    recommended: {
      books: [
        {
          id: 2,
          reason: "Deep Pythonic design: best match for advanced concepts.",
        },
        {
          id: 8,
          reason:
            "Clean code principles to keep advanced projects maintainable.",
        },
      ],
      videos: [
        {
          id: 3,
          reason:
            "Reinforces functions/structure habits (useful at advanced level too).",
        },
      ],
    },
  },

  {
    id: "networks-fundamentals",
    title: "Computer Networks",
    category: "networks",
    difficulty: "intermediate",
    available: true,
    featured: true,
    cover: "/images/thumbnails/networks-cover-big.jpeg",
    description:
      "Understand how computers communicate across modern networks. Explore layers, routing principles, TCP/IP, DNS, and protocols that power the internet.",
    learningGoals: [
      {
        title: "See the big picture",
        text: "Understand network architecture and layers.",
      },
      {
        title: "Follow the data path",
        text: "Explain encapsulation across the stack.",
      },
      {
        title: "Know key protocols",
        text: "Recognize TCP, UDP, HTTP, DNS and common behavior.",
      },
    ],
    sections: [
      {
        id: "net-01",
        title: "Networking Basics",
        summary: "Key concepts, terminology and why networks matter.",
        lessons: [
          {
            id: "net-01-01",
            title: "LAN vs WAN",
            summary: "What changes when distance increases.",
            minutes: 20,
          },
          {
            id: "net-01-02",
            title: "Devices",
            summary: "Switches, routers, APs, and what each does.",
            minutes: 25,
          },
          {
            id: "net-01-03",
            title: "Packets",
            summary: "What a packet is and why it matters.",
            minutes: 25,
          },
        ],
      },
      {
        id: "net-02",
        title: "The TCP/IP Model",
        summary:
          "Layers, addressing, routing and how data moves through the stack.",
        lessons: [
          {
            id: "net-02-01",
            title: "IP addressing",
            summary: "IPv4 basics, masks, and default gateway intuition.",
            minutes: 35,
          },
          {
            id: "net-02-02",
            title: "TCP vs UDP",
            summary: "Reliability vs speed and when each is used.",
            minutes: 30,
          },
          {
            id: "net-02-03",
            title: "DNS basics",
            summary: "Names → IPs and common failure patterns.",
            minutes: 25,
          },
        ],
      },
      {
        id: "net-03",
        title: "Protocols in Practice",
        summary: "HTTP, DNS and real examples of network communication.",
        lessons: [
          {
            id: "net-03-01",
            title: "HTTP request/response",
            summary: "What happens when you open a page.",
            minutes: 30,
          },
          {
            id: "net-03-02",
            title: "Routing intuition",
            summary: "How packets move across networks.",
            minutes: 30,
          },
          {
            id: "net-03-03",
            title: "Common issues",
            summary: "DNS down, wrong gateway, IP conflict.",
            minutes: 30,
          },
        ],
      },
    ],
    questions: [
      {
        question: "Is there math involved?",
        answer: "Only light binary/IP thinking—nothing heavy.",
      },
      {
        question: "Will I be able to read diagrams?",
        answer: "Yes, that’s a key outcome of the course.",
      },
    ],
    recommended: {
      books: [
        {
          id: 3,
          reason: "Top-down explanation style matches these modules well.",
        },
        { id: 11, reason: "Deeper reference for architectures and protocols." },
      ],
      videos: [
        { id: 4, reason: "Fast recap of layers/protocols with visuals." },
      ],
    },
  },

  {
    id: "network-troubleshooting",
    title: "Network Troubleshooting Lab",
    category: "networks",
    difficulty: "intermediate",
    available: true,
    featured: true,
    cover: "/images/thumbnails/networks-cover-2.jpg",
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
      {
        id: "netT-01",
        title: "Toolbox",
        summary: "ping, traceroute, DNS checks and what outputs mean.",
        lessons: [
          {
            id: "netT-01-01",
            title: "ping",
            summary: "Latency, packet loss, and what to test first.",
            minutes: 25,
          },
          {
            id: "netT-01-02",
            title: "traceroute",
            summary: "Find where the path breaks.",
            minutes: 25,
          },
          {
            id: "netT-01-03",
            title: "nslookup",
            summary: "Diagnose name resolution problems.",
            minutes: 25,
          },
        ],
      },
      {
        id: "netT-02",
        title: "Typical Failures",
        summary: "IP conflicts, gateway issues, DNS misconfigurations.",
        lessons: [
          {
            id: "netT-02-01",
            title: "IP conflict",
            summary: "Symptoms + fast checks.",
            minutes: 20,
          },
          {
            id: "netT-02-02",
            title: "Bad gateway",
            summary: "Why you can’t reach outside the LAN.",
            minutes: 25,
          },
          {
            id: "netT-02-03",
            title: "DNS failure",
            summary: "When IP works but names don’t.",
            minutes: 25,
          },
        ],
      },
      {
        id: "netT-03",
        title: "Wi-Fi Basics",
        summary: "Signal, interference, and secure configuration.",
        lessons: [
          {
            id: "netT-03-01",
            title: "Signal strength",
            summary: "Distance, walls, and real limits.",
            minutes: 20,
          },
          {
            id: "netT-03-02",
            title: "Interference",
            summary: "Channels and common causes of instability.",
            minutes: 25,
          },
          {
            id: "netT-03-03",
            title: "Secure setup",
            summary: "WPA2/WPA3, strong passwords, safe defaults.",
            minutes: 25,
          },
        ],
      },
    ],
    questions: [
      {
        question: "Is this theory or practice?",
        answer: "Practice-focused: realistic scenarios and tool outputs.",
      },
      {
        question: "Do I need networking basics?",
        answer: "Yes, knowing IP/DNS basics helps a lot.",
      },
    ],
    recommended: {
      books: [
        {
          id: 11,
          reason: "Solid reference when you want deeper protocol explanations.",
        },
        {
          id: 12,
          reason: "Adds security context for troubleshooting secure networks.",
        },
      ],
      videos: [{ id: 4, reason: "Useful refresh before doing labs." }],
    },
  },

  {
    id: "cybersecurity-essentials",
    title: "Cybersecurity Essentials",
    category: "cybersecurity",
    difficulty: "intermediate",
    available: true,
    featured: true,
    cover: "/images/thumbnails/cybersec-cover-3.jpg",
    description:
      "A comprehensive introduction to core cybersecurity principles: attack types, encryption fundamentals, authentication, secure communication, and best practices.",
    learningGoals: [
      {
        title: "Spot common threats",
        text: "Recognize typical attacks quickly.",
      },
      {
        title: "Learn core concepts",
        text: "Encryption, authentication, and safe habits.",
      },
      {
        title: "Protect systems",
        text: "Apply practical defenses and checklists.",
      },
    ],
    sections: [
      {
        id: "sec-01",
        title: "Threats & Attacks",
        summary: "Malware, phishing, social engineering and attack vectors.",
        lessons: [
          {
            id: "sec-01-01",
            title: "Phishing",
            summary: "Common patterns and how to detect them.",
            minutes: 25,
          },
          {
            id: "sec-01-02",
            title: "Malware types",
            summary: "Ransomware, trojans, spyware, and symptoms.",
            minutes: 30,
          },
          {
            id: "sec-01-03",
            title: "Social engineering",
            summary: "Why humans are the easiest target.",
            minutes: 25,
          },
        ],
      },
      {
        id: "sec-02",
        title: "Security Fundamentals",
        summary: "CIA triad, risk, vulnerabilities and security controls.",
        lessons: [
          {
            id: "sec-02-01",
            title: "CIA triad",
            summary: "Confidentiality, integrity, availability with examples.",
            minutes: 25,
          },
          {
            id: "sec-02-02",
            title: "Risk basics",
            summary: "Threats × vulnerabilities × impact.",
            minutes: 25,
          },
          {
            id: "sec-02-03",
            title: "Controls",
            summary: "Prevent, detect, respond—how teams think.",
            minutes: 30,
          },
        ],
      },
      {
        id: "sec-03",
        title: "Protecting Systems",
        summary: "Passwords, MFA, and secure communication basics.",
        lessons: [
          {
            id: "sec-03-01",
            title: "Passwords & MFA",
            summary: "Strong passwords and why MFA matters.",
            minutes: 25,
          },
          {
            id: "sec-03-02",
            title: "Updates",
            summary: "Patch management and why delays hurt.",
            minutes: 20,
          },
          {
            id: "sec-03-03",
            title: "Safe browsing",
            summary: "Practical everyday defense habits.",
            minutes: 20,
          },
        ],
      },
    ],
    questions: [
      {
        question: "Will I learn practical skills?",
        answer: "Yes—checklists and real scenarios are included.",
      },
      {
        question: "Is it beginner-friendly?",
        answer: "It’s accessible, but it assumes basic computer familiarity.",
      },
    ],
    recommended: {
      books: [
        {
          id: 4,
          reason: "Perfect foundation and matches the scope of this course.",
        },
        {
          id: 13,
          reason: "Next step when you want to understand web attack surfaces.",
        },
      ],
      videos: [
        { id: 5, reason: "Short security explanations to reinforce concepts." },
      ],
    },
  },

  {
    id: "secure-coding",
    title: "Secure Coding Fundamentals",
    category: "cybersecurity",
    difficulty: "intermediate",
    available: true,
    featured: true,
    cover: "/images/thumbnails/cover-6.jpg",
    description:
      "Learn how to write safer code by understanding common vulnerabilities such as injection, insecure authentication, and poor input validation.",
    learningGoals: [
      {
        title: "Avoid common bugs",
        text: "Recognize patterns that lead to vulnerabilities.",
      },
      {
        title: "Validate inputs",
        text: "Apply safe validation and data handling patterns.",
      },
      {
        title: "Think like a defender",
        text: "Connect code choices to real security outcomes.",
      },
    ],
    sections: [
      {
        id: "sc-01",
        title: "Risk in Code",
        summary: "How small bugs become big vulnerabilities.",
        lessons: [
          {
            id: "sc-01-01",
            title: "Threat modeling basics",
            summary: "What could go wrong and why.",
            minutes: 25,
          },
          {
            id: "sc-01-02",
            title: "Trust boundaries",
            summary: "User input is never trusted.",
            minutes: 25,
          },
          {
            id: "sc-01-03",
            title: "Security mindset",
            summary: "Defensive thinking while coding.",
            minutes: 25,
          },
        ],
      },
      {
        id: "sc-02",
        title: "Input & Validation",
        summary: "Sanitization and safe data flows.",
        lessons: [
          {
            id: "sc-02-01",
            title: "Validation rules",
            summary: "Allow-lists vs deny-lists and patterns.",
            minutes: 30,
          },
          {
            id: "sc-02-02",
            title: "Injection basics",
            summary: "Why concatenation is dangerous.",
            minutes: 30,
          },
          {
            id: "sc-02-03",
            title: "Safe output",
            summary: "Escaping and encoding in practice.",
            minutes: 30,
          },
        ],
      },
      {
        id: "sc-03",
        title: "Auth & Sessions",
        summary: "Safer login and session concepts.",
        lessons: [
          {
            id: "sc-03-01",
            title: "Authentication mistakes",
            summary: "Common failures and how to avoid them.",
            minutes: 25,
          },
          {
            id: "sc-03-02",
            title: "Sessions",
            summary: "Cookies, expiry, and secure defaults.",
            minutes: 25,
          },
          {
            id: "sc-03-03",
            title: "Password storage",
            summary: "Hashing, salts, and why plaintext is fatal.",
            minutes: 25,
          },
        ],
      },
    ],
    questions: [
      {
        question: "Is this ethical hacking?",
        answer: "It’s defensive: focused on writing code that resists attacks.",
      },
      {
        question: "Do I need web dev knowledge?",
        answer: "It helps, but examples are explained step-by-step.",
      },
    ],
    recommended: {
      books: [
        {
          id: 13,
          reason:
            "Great for understanding web vulnerabilities and testing mindset.",
        },
        {
          id: 8,
          reason:
            "Clean code habits reduce mistakes and improve maintainability.",
        },
      ],
      videos: [
        { id: 5, reason: "Reinforces security concepts and common pitfalls." },
      ],
    },
  },

  {
    id: "sql-databases",
    title: "Databases with SQL",
    category: "databases",
    difficulty: "beginner",
    available: true,
    featured: false,
    cover: "/images/thumbnails/dabases-cover-2.jpg",
    description:
      "Learn how to store, organize, and query data using SQL. Covers table design, relationships, CRUD, joins, filtering, and real query examples.",
    learningGoals: [
      {
        title: "Understand relational DBs",
        text: "Know what tables/relations are and why they work.",
      },
      {
        title: "Write core SQL",
        text: "INSERT, UPDATE, DELETE and SELECT queries.",
      },
      {
        title: "Use joins",
        text: "Combine data across tables to answer real questions.",
      },
    ],
    sections: [
      {
        id: "db-01",
        title: "Relational Database Basics",
        summary: "Tables, rows, keys and relationships.",
        lessons: [
          {
            id: "db-01-01",
            title: "Tables & keys",
            summary: "Primary keys and why uniqueness matters.",
            minutes: 25,
          },
          {
            id: "db-01-02",
            title: "Relationships",
            summary: "1–1, 1–many, many–many with examples.",
            minutes: 30,
          },
          {
            id: "db-01-03",
            title: "Modeling practice",
            summary: "Turn a real scenario into tables.",
            minutes: 30,
          },
        ],
      },
      {
        id: "db-02",
        title: "Core SQL Operations",
        summary: "CRUD + filtering and sorting.",
        lessons: [
          {
            id: "db-02-01",
            title: "SELECT basics",
            summary: "SELECT, WHERE, ORDER BY, LIMIT.",
            minutes: 35,
          },
          {
            id: "db-02-02",
            title: "INSERT/UPDATE/DELETE",
            summary: "Write safe and correct updates.",
            minutes: 35,
          },
          {
            id: "db-02-03",
            title: "Aggregations",
            summary: "GROUP BY, COUNT, SUM, AVG.",
            minutes: 30,
          },
        ],
      },
      {
        id: "db-03",
        title: "Joins & Practical Queries",
        summary: "Join tables and build realistic queries.",
        lessons: [
          {
            id: "db-03-01",
            title: "INNER JOIN",
            summary: "Combine matching rows with confidence.",
            minutes: 35,
          },
          {
            id: "db-03-02",
            title: "LEFT JOIN",
            summary: "Include missing data and handle NULLs.",
            minutes: 35,
          },
          {
            id: "db-03-03",
            title: "Mini report",
            summary: "Create a small report query for a dataset.",
            minutes: 35,
          },
        ],
      },
    ],
    questions: [
      {
        question: "Do I need programming?",
        answer: "No. SQL is declarative—focus on tables and data.",
      },
      {
        question: "Which DB do you use?",
        answer:
          "Any relational DB (e.g., PostgreSQL/MySQL). Skills transfer easily.",
      },
    ],
    recommended: {
      books: [
        {
          id: 5,
          reason: "Practical SQL for analysis and real query workflows.",
        },
        {
          id: 15,
          reason:
            "Strong foundation for concepts like keys, constraints, and transactions.",
        },
      ],
      videos: [
        {
          id: 6,
          reason: "Short explanations to reinforce joins + query logic.",
        },
      ],
    },
  },

  {
    id: "db-design",
    title: "Database Design Essentials",
    category: "databases",
    difficulty: "intermediate",
    available: true,
    featured: true,
    cover: "/images/thumbnails/databases-cover-5.jpg",
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
        text: "Connect design choices to performance and reliability.",
      },
    ],
    sections: [
      {
        id: "dbD-01",
        title: "Modeling Data",
        summary: "Entities, relationships and common patterns.",
        lessons: [
          {
            id: "dbD-01-01",
            title: "Entities & attributes",
            summary: "Turn real objects into structured tables.",
            minutes: 30,
          },
          {
            id: "dbD-01-02",
            title: "Cardinality",
            summary: "1–many, many–many modeling correctly.",
            minutes: 30,
          },
          {
            id: "dbD-01-03",
            title: "Constraints",
            summary: "NOT NULL, UNIQUE, FK and why they matter.",
            minutes: 30,
          },
        ],
      },
      {
        id: "dbD-02",
        title: "Normalization",
        summary: "1NF → 3NF with clear examples.",
        lessons: [
          {
            id: "dbD-02-01",
            title: "1NF/2NF",
            summary: "Eliminate repeating groups and partial dependencies.",
            minutes: 35,
          },
          {
            id: "dbD-02-02",
            title: "3NF",
            summary: "Remove transitive dependencies for cleaner design.",
            minutes: 35,
          },
          {
            id: "dbD-02-03",
            title: "Practical normalization",
            summary: "Normalize a messy dataset step-by-step.",
            minutes: 35,
          },
        ],
      },
      {
        id: "dbD-03",
        title: "Schema in Practice",
        summary: "Design tradeoffs for real apps.",
        lessons: [
          {
            id: "dbD-03-01",
            title: "Indexing intuition",
            summary: "Why indexes matter (conceptually).",
            minutes: 25,
          },
          {
            id: "dbD-03-02",
            title: "Transactions",
            summary: "ACID basics and safe updates.",
            minutes: 30,
          },
          {
            id: "dbD-03-03",
            title: "Case study",
            summary: "Design a small schema for a web app.",
            minutes: 35,
          },
        ],
      },
    ],
    questions: [
      {
        question: "Do I need SQL first?",
        answer: "Basic SQL helps, but this is mainly design logic.",
      },
      {
        question: "Will this help with ER diagrams?",
        answer: "Yes—this course is built around modeling.",
      },
    ],
    recommended: {
      books: [
        {
          id: 15,
          reason: "Academic base for schema/transactions/architecture.",
        },
        { id: 16, reason: "Modern view of real systems and design tradeoffs." },
      ],
      videos: [
        {
          id: 6,
          reason: "Good reinforcement for advanced query/design thinking.",
        },
      ],
    },
  },

  {
    id: "html-css-foundations",
    title: "HTML & CSS Foundations",
    category: "web-development",
    difficulty: "beginner",
    available: false,
    featured: false,
    cover: "/images/thumbnails/cover-2.jpg",
    description:
      "Learn modern HTML structure and responsive CSS layouts. Includes flexbox, grid basics, and small page-building exercises.",
    learningGoals: [
      {
        title: "Build layouts",
        text: "Use semantic HTML and clean structure.",
      },
      {
        title: "Style confidently",
        text: "Use modern CSS patterns for responsive UI.",
      },
      {
        title: "Ship small pages",
        text: "Finish mini layouts you can reuse later.",
      },
    ],
    sections: [
      {
        id: "web-01",
        title: "Semantic HTML",
        summary: "Structure, headings, sections, forms basics.",
        lessons: [
          {
            id: "web-01-01",
            title: "Semantic tags",
            summary: "header/nav/main/section/footer and why they matter.",
            minutes: 25,
          },
          {
            id: "web-01-02",
            title: "Accessible structure",
            summary: "Labels, alt text, and clean hierarchy.",
            minutes: 25,
          },
          {
            id: "web-01-03",
            title: "Mini page build",
            summary: "Build a simple page with proper sections.",
            minutes: 35,
          },
        ],
      },
      {
        id: "web-02",
        title: "Modern CSS",
        summary: "Spacing, flexbox, grid and consistent UI.",
        lessons: [
          {
            id: "web-02-01",
            title: "Box model + spacing",
            summary: "Margin/padding and consistent spacing scale.",
            minutes: 25,
          },
          {
            id: "web-02-02",
            title: "Flexbox",
            summary: "Row/column layouts and alignment patterns.",
            minutes: 35,
          },
          {
            id: "web-02-03",
            title: "Grid basics",
            summary: "Two-column layouts and responsive grids.",
            minutes: 35,
          },
        ],
      },
      {
        id: "web-03",
        title: "Responsive Design",
        summary: "Mobile-first approach + breakpoints.",
        lessons: [
          {
            id: "web-03-01",
            title: "Media queries",
            summary: "Breakpoints and typical device layouts.",
            minutes: 25,
          },
          {
            id: "web-03-02",
            title: "Fluid UI",
            summary: "Percentages, max-width, and flexible images.",
            minutes: 25,
          },
          {
            id: "web-03-03",
            title: "Mini responsive project",
            summary: "Turn your layout into a responsive page.",
            minutes: 40,
          },
        ],
      },
    ],
    questions: [
      {
        question: "Do I need design background?",
        answer: "No—everything is built step-by-step.",
      },
      {
        question: "Will I build real pages?",
        answer: "Yes, small responsive pages.",
      },
    ],
    recommended: {
      books: [
        {
          id: 18,
          reason: "Great companion once you add JavaScript to your pages.",
        },
        {
          id: 17,
          reason:
            "Helpful for common mistakes around data/DB thinking in web apps.",
        },
      ],
      videos: [
        { id: 8, reason: "Quick CSS recap (useful during layout practice)." },
      ],
    },
  },

  {
    id: "javascript-dom",
    title: "JavaScript & the DOM",
    category: "web-development",
    difficulty: "intermediate",
    available: true,
    featured: false,
    cover: "/images/thumbnails/js-cover-3.jpg",
    description:
      "Make websites interactive by mastering events, DOM manipulation, basic state patterns, and browser APIs.",
    learningGoals: [
      {
        title: "Manipulate UI",
        text: "Update the DOM safely and dynamically.",
      },
      {
        title: "Handle events",
        text: "Build clean interactive flows and behaviors.",
      },
      {
        title: "Use browser APIs",
        text: "LocalStorage, basic async patterns, and utilities.",
      },
    ],
    sections: [
      {
        id: "dom-01",
        title: "DOM Foundations",
        summary: "Selectors, nodes and creating elements.",
        lessons: [
          {
            id: "dom-01-01",
            title: "Selecting elements",
            summary: "querySelector, querySelectorAll, and safe patterns.",
            minutes: 25,
          },
          {
            id: "dom-01-02",
            title: "Creating nodes",
            summary: "createElement, append, remove, and templates.",
            minutes: 35,
          },
          {
            id: "dom-01-03",
            title: "Updating UI",
            summary: "classList, textContent vs innerHTML, and why it matters.",
            minutes: 35,
          },
        ],
      },
      {
        id: "dom-02",
        title: "Events",
        summary: "Click/input events and delegation.",
        lessons: [
          {
            id: "dom-02-01",
            title: "Event basics",
            summary: "Handlers, preventDefault, stopPropagation.",
            minutes: 30,
          },
          {
            id: "dom-02-02",
            title: "Event delegation",
            summary: "One listener for many items.",
            minutes: 30,
          },
          {
            id: "dom-02-03",
            title: "UI patterns",
            summary: "Toggle, filter, and small state patterns.",
            minutes: 35,
          },
        ],
      },
      {
        id: "dom-03",
        title: "Browser APIs",
        summary: "Storage + basic async.",
        lessons: [
          {
            id: "dom-03-01",
            title: "LocalStorage",
            summary: "Persist UI state and user choices.",
            minutes: 25,
          },
          {
            id: "dom-03-02",
            title: "Fetch basics",
            summary: "Get data and render it (concept + demo).",
            minutes: 35,
          },
          {
            id: "dom-03-03",
            title: "Mini project",
            summary: "Build a small interactive widget/page.",
            minutes: 45,
          },
        ],
      },
    ],
    questions: [
      {
        question: "Do I need HTML/CSS first?",
        answer: "Yes, basic familiarity helps a lot.",
      },
      {
        question: "Will this prepare me for frameworks?",
        answer: "Yes—DOM + state concepts translate well to React/Vue.",
      },
    ],
    recommended: {
      books: [
        {
          id: 18,
          reason: "Hands-on JavaScript + DOM explanations with practice.",
        },
        {
          id: 8,
          reason: "Better structure and readability for bigger front-end code.",
        },
      ],
      videos: [
        { id: 8, reason: "Helpful alongside UI work (layout + polish)." },
      ],
    },
  },

  {
    id: "ai-fundamentals-lab",
    title: "AI Fundamentals Lab",
    category: "ai",
    difficulty: "beginner",
    available: true,
    featured: true,
    cover: "/images/thumbnails/cat-ai-cover.jpeg",
    description:
      "Learn core AI concepts with simple, visual explanations and hands-on mini tasks. Focuses on how models learn and how to use AI responsibly.",
    learningGoals: [
      {
        title: "Understand core ideas",
        text: "Data, features, models, training.",
      },
      {
        title: "Build intuition",
        text: "Why models fail and how to improve them.",
      },
      {
        title: "Use AI responsibly",
        text: "Bias, privacy and safe usage basics.",
      },
    ],
    sections: [
      {
        id: "ai-01",
        title: "What is AI?",
        summary: "AI vs ML vs DL and practical examples.",
        lessons: [
          {
            id: "ai-01-01",
            title: "AI vs ML",
            summary: "Definitions and what each one means.",
            minutes: 20,
          },
          {
            id: "ai-01-02",
            title: "Real examples",
            summary: "Where AI appears in apps you already use.",
            minutes: 25,
          },
          {
            id: "ai-01-03",
            title: "Limits",
            summary: "What AI can’t do reliably (and why).",
            minutes: 25,
          },
        ],
      },
      {
        id: "ai-02",
        title: "How Models Learn",
        summary: "Training, validation and overfitting intuition.",
        lessons: [
          {
            id: "ai-02-01",
            title: "Training loop",
            summary: "Inputs → predictions → feedback → improvements.",
            minutes: 30,
          },
          {
            id: "ai-02-02",
            title: "Overfitting",
            summary: "When a model memorizes instead of generalizing.",
            minutes: 30,
          },
          {
            id: "ai-02-03",
            title: "Evaluation",
            summary: "Accuracy, precision/recall in simple terms.",
            minutes: 30,
          },
        ],
      },
      {
        id: "ai-03",
        title: "Ethics & Safety",
        summary: "Bias, privacy and responsible use.",
        lessons: [
          {
            id: "ai-03-01",
            title: "Bias basics",
            summary: "How biased data creates biased outcomes.",
            minutes: 25,
          },
          {
            id: "ai-03-02",
            title: "Privacy",
            summary: "What to avoid sharing with AI tools.",
            minutes: 20,
          },
          {
            id: "ai-03-03",
            title: "Verification habits",
            summary: "How to check outputs and reduce hallucinations.",
            minutes: 25,
          },
        ],
      },
    ],
    questions: [
      {
        question: "Do I need math to start?",
        answer: "No—math is kept light and intuitive.",
      },
      {
        question: "Will I code?",
        answer:
          "Optional—concept-only is fine, with small guided tasks available.",
      },
    ],
    recommended: {
      books: [
        {
          id: 19,
          reason: "Beginner-friendly AI-themed learning support content.",
        },
        {
          id: 20,
          reason: "Extra reading for building routine and confidence.",
        },
      ],
      videos: [
        {
          id: 7,
          reason: "Short visual AI explanations + responsible use reminders.",
        },
      ],
    },
  },

  {
    id: "prompting-and-ai-tools",
    title: "Prompting & AI Tools Workshop",
    category: "ai",
    difficulty: "intermediate",
    available: true,
    featured: false,
    cover: "/images/thumbnails/cover-25.jpg",
    description:
      "A practical workshop on using modern AI tools effectively: prompting, workflows, evaluation, and building small AI-assisted projects.",
    learningGoals: [
      {
        title: "Write strong prompts",
        text: "Structure prompts for clarity and constraints.",
      },
      {
        title: "Evaluate outputs",
        text: "Spot hallucinations and verify safely.",
      },
      {
        title: "Build workflows",
        text: "Use AI for study, coding, and planning with good habits.",
      },
    ],
    sections: [
      {
        id: "pr-01",
        title: "Prompt Patterns",
        summary: "Templates for summaries, coding, planning, and revision.",
        lessons: [
          {
            id: "pr-01-01",
            title: "Clear constraints",
            summary: "How to get consistent outputs.",
            minutes: 25,
          },
          {
            id: "pr-01-02",
            title: "Step-by-step prompts",
            summary: "Break tasks into reliable steps.",
            minutes: 30,
          },
          {
            id: "pr-01-03",
            title: "Quality iteration",
            summary: "Refine prompts with feedback loops.",
            minutes: 30,
          },
        ],
      },
      {
        id: "pr-02",
        title: "Verification & Safety",
        summary: "Checks, citations, bias and privacy.",
        lessons: [
          {
            id: "pr-02-01",
            title: "Verification checklist",
            summary: "How to verify facts and outputs quickly.",
            minutes: 25,
          },
          {
            id: "pr-02-02",
            title: "Bias awareness",
            summary: "Recognize bias and improve prompts.",
            minutes: 25,
          },
          {
            id: "pr-02-03",
            title: "Privacy rules",
            summary: "What not to share and safe usage habits.",
            minutes: 20,
          },
        ],
      },
      {
        id: "pr-03",
        title: "Mini AI Projects",
        summary: "Build small AI-assisted deliverables step-by-step.",
        lessons: [
          {
            id: "pr-03-01",
            title: "Study helper workflow",
            summary: "Summaries + flashcards + revision routine.",
            minutes: 35,
          },
          {
            id: "pr-03-02",
            title: "Coding assistant workflow",
            summary: "Prompts for debugging and safe refactoring.",
            minutes: 40,
          },
          {
            id: "pr-03-03",
            title: "Final mini project",
            summary: "Create a small AI-assisted output with verification.",
            minutes: 45,
          },
        ],
      },
    ],
    questions: [
      {
        question: "Which AI tool does this use?",
        answer: "Tool-agnostic. Skills apply across most assistants.",
      },
      {
        question: "Is it okay for students?",
        answer: "Yes—strong focus on ethics, originality, and verification.",
      },
    ],
    recommended: {
      books: [
        {
          id: 19,
          reason: "Supports building study routines around technical topics.",
        },
        {
          id: 20,
          reason: "Extra practice for goals and structured learning habits.",
        },
      ],
      videos: [
        {
          id: 7,
          reason: "Helpful visual reinforcement for AI concepts + safe use.",
        },
      ],
    },
  },
];

module.exports = COURSES;