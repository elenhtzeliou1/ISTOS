const COURSES = [
  {
    id: "python-intro",
    title: "Introduction to Python",
    category: "programming",
    difficulty: "beginner",
    available: true,
    featured: true,
    cover: "assets/images/courses/python-intro.jpg",
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
    cover: "assets/images/courses/python-intro.jpg",
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
    cover: "assets/images/courses/networks.avif",
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
    cover: "assets/images/courses/hac.avif",
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
    cover: "assets/images/courses/cybersec.avif",
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
];
