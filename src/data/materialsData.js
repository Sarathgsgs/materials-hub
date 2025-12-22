export const semesterData = {
  semesterName: "Semester 5 - Computer Science",
  academicYear: "2024-25",
  subjects: [
    {
      id: "cs501",
      name: "Data Structures",
      code: "CS501",
      credits: 4,
      professor: "Dr. Smith",
      color: "#667eea",
      icon: "📊",
      units: [
        {
          id: "unit1",
          name: "Unit 1 - Introduction to Data Structures",
          files: [
            {
              name: "Introduction to DS.pdf",
              type: "pdf",
              size: "2.5 MB",
              path: "/materials/data-structures/unit1/intro.pdf",
              uploadDate: "2024-01-15"
            },
            {
              name: "Arrays and Linked Lists.pdf",
              type: "pdf",
              size: "3.1 MB",
              path: "/materials/data-structures/unit1/arrays-linkedlist.pdf",
              uploadDate: "2024-01-16"
            },
            {
              name: "Lecture Slides.pptx",
              type: "ppt",
              size: "5.2 MB",
              path: "/materials/data-structures/unit1/lecture.pptx",
              uploadDate: "2024-01-17"
            }
          ]
        },
        {
          id: "unit2",
          name: "Unit 2 - Stacks and Queues",
          files: [
            {
              name: "Stack Operations.pdf",
              type: "pdf",
              size: "1.8 MB",
              path: "/materials/data-structures/unit2/stacks.pdf",
              uploadDate: "2024-02-01"
            },
            {
              name: "Queue Implementation.pdf",
              type: "pdf",
              size: "2.2 MB",
              path: "/materials/data-structures/unit2/queues.pdf",
              uploadDate: "2024-02-05"
            }
          ]
        },
        {
          id: "unit3",
          name: "Unit 3 - Trees",
          files: []
        },
        {
          id: "unit4",
          name: "Unit 4 - Graphs",
          files: []
        },
        {
          id: "unit5",
          name: "Unit 5 - Sorting and Searching",
          files: []
        },
        {
          id: "mini-qb",
          name: "Mini Question Bank",
          isMiniQB: true,
          files: [
            {
              name: "Important Questions - All Units.pdf",
              type: "pdf",
              size: "1.5 MB",
              path: "/materials/data-structures/mini-qb/questions.pdf",
              uploadDate: "2024-03-01"
            },
            {
              name: "Previous Year Papers.pdf",
              type: "pdf",
              size: "4.0 MB",
              path: "/materials/data-structures/mini-qb/previous-papers.pdf",
              uploadDate: "2024-03-02"
            }
          ]
        }
      ]
    },
    {
      id: "cs502",
      name: "Database Management Systems",
      code: "CS502",
      credits: 4,
      professor: "Dr. Johnson",
      color: "#f093fb",
      icon: "🗄️",
      units: [
        {
          id: "unit1",
          name: "Unit 1 - Introduction to DBMS",
          files: [
            {
              name: "DBMS Fundamentals.pdf",
              type: "pdf",
              size: "3.0 MB",
              path: "/materials/dbms/unit1/fundamentals.pdf",
              uploadDate: "2024-01-10"
            }
          ]
        },
        {
          id: "unit2",
          name: "Unit 2 - SQL Basics",
          files: []
        },
        {
          id: "unit3",
          name: "Unit 3 - Normalization",
          files: []
        },
        {
          id: "unit4",
          name: "Unit 4 - Transactions",
          files: []
        },
        {
          id: "unit5",
          name: "Unit 5 - Advanced Topics",
          files: []
        },
        {
          id: "mini-qb",
          name: "Mini Question Bank",
          isMiniQB: true,
          files: []
        }
      ]
    },
    {
      id: "cs503",
      name: "Operating Systems",
      code: "CS503",
      credits: 4,
      professor: "Dr. Williams",
      color: "#4facfe",
      icon: "💻",
      units: [
        {
          id: "unit1",
          name: "Unit 1 - OS Introduction",
          files: []
        },
        {
          id: "unit2",
          name: "Unit 2 - Process Management",
          files: []
        },
        {
          id: "unit3",
          name: "Unit 3 - Memory Management",
          files: []
        },
        {
          id: "unit4",
          name: "Unit 4 - File Systems",
          files: []
        },
        {
          id: "unit5",
          name: "Unit 5 - Security",
          files: []
        },
        {
          id: "mini-qb",
          name: "Mini Question Bank",
          isMiniQB: true,
          files: []
        }
      ]
    }
  ]
};