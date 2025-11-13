import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "AIzaSyDummy-Key-For-Testing"
);

interface Exercise {
  title: string;
  description: string;
  code: string;
  solution: string;
  hints: string[];
  testCases: Array<{ input: string; expected: string }>;
}

interface RoadmapStage {
  name: string;
  goals: string[];
  exercises: Exercise[];
  resources: string[];
  projects: string[];
  estimatedWeeks: number;
  completed: boolean;
  completedExercises: number;
}

// Retry function with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a retryable error (503, 429, or network errors)
      const isRetryable = 
        error.status === 503 || 
        error.status === 429 || 
        error.message?.includes("overloaded") ||
        error.message?.includes("rate limit");
      
      if (!isRetryable || attempt === maxRetries - 1) {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = initialDelay * Math.pow(2, attempt);
      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

export async function generateInteractiveRoadmap(
  userProfile: {
    skills: string[];
    preferredTrack: string;
    experienceLevel: string;
    targetRole: string;
  }
): Promise<RoadmapStage[]> {
  try {
    // Try different models in order of preference
    const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });

        const prompt = `Create an interactive, hands-on learning roadmap for someone who wants to become a ${userProfile.targetRole}.

Current Profile:
- Current Skills: ${userProfile.skills.join(", ") || "Beginner"}
- Preferred Track: ${userProfile.preferredTrack}
- Experience Level: ${userProfile.experienceLevel}

Create a JSON roadmap with exactly 3 stages, each with interactive coding exercises.

For each stage, provide:
1. 4-6 specific learning goals
2. 3-4 hands-on coding exercises with:
   - Exercise title
   - Description of what to build
   - Starter code template
   - Complete solution code
   - 2-3 helpful hints
   - Test cases to validate
3. 3-4 free learning resources (suggest FreeCodeCamp and JavaScriptMastery YouTube courses when relevant)
4. 2-3 capstone projects
5. Realistic time estimate
6. Suggested courses (both free YouTube courses and paid Udemy courses related to the stage)

JSON Structure:
{
  "stages": [
    {
      "name": "Stage name",
      "goals": ["goal 1", "goal 2", "goal 3", "goal 4"],
      "exercises": [
        {
          "title": "Exercise name",
          "description": "What to build",
          "code": "<!-- Starter code here -->",
          "solution": "<!-- Complete solution -->",
          "hints": ["hint 1", "hint 2"],
          "testCases": [
            {"input": "test input", "expected": "expected output"}
          ]
        }
      ],
      "resources": ["resource 1", "resource 2"],
      "projects": ["project 1", "project 2"],
      "suggestedCourses": {
        "youtube": ["FreeCodeCamp JavaScript Course", "JavaScriptMastery React Tutorial"],
        "udemy": ["Complete JavaScript Course", "React Bootcamp"]
      },
      "estimatedWeeks": number,
      "completed": false,
      "completedExercises": 0
    }
  ]
}

IMPORTANT:
- For HTML/CSS exercises: provide actual HTML code to practice
- For JavaScript: provide runnable code snippets
- For React: provide component code
- Make exercises progressively harder
- Include comments in code explaining concepts
- Make code copy-paste ready for testing
- Suggest relevant courses from FreeCodeCamp and JavaScriptMastery for YouTube
- Suggest relevant Udemy courses that match the stage content

Return ONLY valid JSON, no markdown or extra text.`;

        console.log("Calling Gemini API for roadmap generation...");
        const startTime = Date.now();
        
        // Use retry logic for 503/429 errors
        const result = await retryWithBackoff(async () => {
          return await model.generateContent(prompt);
        });
        
        const response = await result.response;
        const text = response.text();

        const endTime = Date.now();
        console.log(`✅ Gemini API (${modelName}) response received in ${endTime - startTime}ms`);
        console.log("Gemini response length:", text.length, "characters");
        console.log("Gemini response preview:", text.substring(0, 200) + "...");

        // Extract JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.error("No JSON found in Gemini response. Full response:", text);
          throw new Error("No JSON in response");
        }

        try {
          const roadmapData = JSON.parse(jsonMatch[0]);
          console.log("Successfully parsed Gemini response. Stages count:", roadmapData.stages?.length || 0);
          return roadmapData.stages;
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          console.error("JSON match:", jsonMatch[0].substring(0, 500));
          throw new Error("Failed to parse JSON from Gemini response");
        }
      } catch (modelError: any) {
        console.warn(`Model ${modelName} failed:`, modelError.message);
        lastError = modelError;
        
        // If it's a 503 or overloaded error, try next model
        if (modelError.status === 503 || modelError.message?.includes("overloaded")) {
          continue; // Try next model
        }
        
        // For other errors, throw immediately
        throw modelError;
      }
    }
    
    // If all models failed, throw the last error
    throw lastError || new Error("All Gemini models failed");
  } catch (error: any) {
    console.error("Gemini AI error (all models failed):", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
      status: error.status,
    });
    
    // Return fallback with interactive exercises
    console.log("Falling back to template-based roadmap with exercises");
    return getFallbackInteractiveRoadmap(userProfile.preferredTrack);
  }
}

function getFallbackInteractiveRoadmap(track: string): RoadmapStage[] {
  const htmlCSSExercises: Exercise[] = [
    {
      title: "Create Your First Webpage",
      description: "Build a simple HTML page with a heading, paragraph, and image",
      code: `<!DOCTYPE html>
<html>
<head>
    <title>My First Page</title>
</head>
<body>
    <!-- Add an h1 heading here -->
    
    <!-- Add a paragraph here -->
    
    <!-- Add an image here -->
</body>
</html>`,
      solution: `<!DOCTYPE html>
<html>
<head>
    <title>My First Page</title>
</head>
<body>
    <h1>Welcome to My Page</h1>
    <p>This is my first webpage!</p>
    <img src="https://via.placeholder.com/300" alt="Placeholder">
</body>
</html>`,
      hints: [
        "Use <h1> tag for heading",
        "Use <p> tag for paragraph",
        "Use <img> tag with src attribute"
      ],
      testCases: [
        { input: "HTML structure", expected: "Must have h1, p, and img tags" }
      ],
    },
    {
      title: "Style with CSS",
      description: "Add styles to make your page beautiful",
      code: `<!DOCTYPE html>
<html>
<head>
    <style>
        /* Add CSS styles here */
        body {
            /* Set font family and background color */
        }
        
        h1 {
            /* Make heading colorful */
        }
    </style>
</head>
<body>
    <h1>Styled Heading</h1>
    <p>This text needs styling!</p>
</body>
</html>`,
      solution: `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            padding: 20px;
        }
        
        h1 {
            color: #e11d48;
            text-align: center;
        }
        
        p {
            color: #333;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <h1>Styled Heading</h1>
    <p>This text is now beautifully styled!</p>
</body>
</html>`,
      hints: [
        "Use background-color for body",
        "Use color property for text color",
        "Try text-align: center for centering"
      ],
      testCases: [
        { input: "CSS rules", expected: "Must have styles for body, h1, and p" }
      ],
    },
    {
      title: "Create a Flexbox Layout",
      description: "Use CSS Flexbox to create a responsive card layout",
      code: `<!DOCTYPE html>
<html>
<head>
    <style>
        .container {
            /* Add flexbox styles here */
        }
        
        .card {
            /* Style the cards */
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">Card 1</div>
        <div class="card">Card 2</div>
        <div class="card">Card 3</div>
    </div>
</body>
</html>`,
      solution: `<!DOCTYPE html>
<html>
<head>
    <style>
        .container {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            width: 200px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">Card 1</div>
        <div class="card">Card 2</div>
        <div class="card">Card 3</div>
    </div>
</body>
</html>`,
      hints: [
        "Use display: flex on container",
        "Use gap for spacing between items",
        "Add box-shadow for depth"
      ],
      testCases: [
        { input: "Flexbox", expected: "Container must use display: flex" }
      ],
    },
  ];

  const javascriptExercises: Exercise[] = [
    {
      title: "Variables and Data Types",
      description: "Practice declaring variables and using different data types",
      code: `// Declare a variable for your name


// Declare a variable for your age


// Declare a variable for whether you like coding (true/false)


// Print all variables
console.log(name, age, likesCoding);`,
      solution: `// Declare a variable for your name
let name = "John Doe";

// Declare a variable for your age
let age = 25;

// Declare a variable for whether you like coding (true/false)
let likesCoding = true;

// Print all variables
console.log(name, age, likesCoding);`,
      hints: [
        "Use let or const to declare variables",
        "Strings use quotes: \"text\"",
        "Boolean is true or false (no quotes)"
      ],
      testCases: [
        { input: "Variables", expected: "Must declare name, age, likesCoding" }
      ],
    },
    {
      title: "Create a Function",
      description: "Write a function that adds two numbers",
      code: `// Create a function called 'add' that takes two parameters


// Test your function
console.log(add(5, 3)); // Should print 8
console.log(add(10, 20)); // Should print 30`,
      solution: `// Create a function called 'add' that takes two parameters
function add(a, b) {
    return a + b;
}

// Test your function
console.log(add(5, 3)); // Should print 8
console.log(add(10, 20)); // Should print 30`,
      hints: [
        "Use function keyword",
        "Add return statement",
        "Add the two parameters together"
      ],
      testCases: [
        { input: "add(5, 3)", expected: "8" },
        { input: "add(10, 20)", expected: "30" }
      ],
    },
    {
      title: "Array Methods",
      description: "Practice using array methods like map, filter, reduce",
      code: `const numbers = [1, 2, 3, 4, 5];

// Use map to double each number


// Use filter to get only even numbers


// Use reduce to sum all numbers


console.log(doubled, evens, sum);`,
      solution: `const numbers = [1, 2, 3, 4, 5];

// Use map to double each number
const doubled = numbers.map(n => n * 2);

// Use filter to get only even numbers
const evens = numbers.filter(n => n % 2 === 0);

// Use reduce to sum all numbers
const sum = numbers.reduce((acc, n) => acc + n, 0);

console.log(doubled, evens, sum);`,
      hints: [
        "map() transforms each element",
        "filter() keeps elements that match condition",
        "reduce() combines all elements into one value"
      ],
      testCases: [
        { input: "doubled", expected: "[2,4,6,8,10]" },
        { input: "evens", expected: "[2,4]" },
        { input: "sum", expected: "15" }
      ],
    },
  ];

  // Return stage with exercises based on track
  if (track === "Frontend Development") {
    return [
      {
        name: "HTML & CSS Fundamentals",
        goals: [
          "Understand HTML structure and semantic elements",
          "Master CSS selectors and properties",
          "Learn Flexbox and Grid layouts",
          "Build responsive designs",
        ],
        exercises: htmlCSSExercises,
        resources: [
          "MDN Web Docs - HTML",
          "CSS-Tricks - Flexbox Guide",
          "freeCodeCamp - Responsive Web Design",
        ],
        projects: [
          "Personal Portfolio Page",
          "Landing Page Clone",
        ],
        estimatedWeeks: 4,
        completed: false,
        completedExercises: 0,
      },
      {
        name: "JavaScript Fundamentals",
        goals: [
          "Variables, data types, operators",
          "Functions and scope",
          "Arrays and objects",
          "DOM manipulation",
          "Event handling",
        ],
        exercises: javascriptExercises,
        resources: [
          "JavaScript.info",
          "Eloquent JavaScript (free book)",
          "freeCodeCamp - JavaScript",
        ],
        projects: [
          "Todo List App",
          "Calculator",
          "Interactive Form",
        ],
        estimatedWeeks: 6,
        completed: false,
        completedExercises: 0,
      },
      {
        name: "React & Modern Frontend",
        goals: [
          "React components and props",
          "State management with hooks",
          "API integration",
          "Routing with React Router",
        ],
        exercises: [],
        resources: [
          "React Official Docs",
          "React Beta Docs",
        ],
        projects: [
          "Weather App with API",
          "Social Media Dashboard",
        ],
        estimatedWeeks: 8,
        completed: false,
        completedExercises: 0,
      },
    ];
  }

  return [];
}

export { type Exercise, type RoadmapStage };





