/**
 * Udemy API Integration via RapidAPI
 * Uses RapidAPI's Udemy Paid Courses for Free API
 * Endpoint: https://udemy-paid-courses-for-free-api.p.rapidapi.com
 */

interface RapidAPICourse {
  id: number;
  title: string;
  headline?: string;
  url?: string;
  coupon?: string;
  link?: string;
  pic?: string;
  image_480x270?: string;
  image_750x422?: string;
  instructor_name?: string;
  instructor?: string;
  rating?: number;
  num_subscribers?: number;
  num_students?: number;
  price?: string;
  org_price?: string;
  price_detail?: {
    amount: number;
    currency: string;
    price_string: string;
  };
  desc_text?: string;
  description?: string;
  category?: string;
  level?: string;
  content_length_video?: number;
  duration?: number;
  language?: string;
  created?: string;
  last_update_date?: string;
  objectives?: string[];
  requirements?: string[];
  what_you_will_learn?: string[];
  target_audiences?: string[];
  visible_instructors?: Array<{
    name: string;
    display_name?: string;
    job_title?: string;
    image_100x100?: string;
    image_50x50?: string;
    url?: string;
  }>;
}

interface RapidAPICourseListResponse {
  courses?: RapidAPICourse[];
  data?: RapidAPICourse[];
  results?: RapidAPICourse[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

/**
 * Get RapidAPI headers
 */
function getRapidAPIHeaders(): Record<string, string> {
  const apiKey = process.env.RAPIDAPI_KEY;
  const apiHost = process.env.RAPIDAPI_UDEMY_HOST || "udemy-paid-courses-for-free-api.p.rapidapi.com";

  if (!apiKey) {
    throw new Error("RAPIDAPI_KEY environment variable is not set");
  }

  return {
    "x-rapidapi-key": apiKey,
    "x-rapidapi-host": apiHost,
    "Content-Type": "application/json",
  };
}

/**
 * Search Udemy courses via RapidAPI
 */
export async function searchUdemyCourses(
  searchQuery: string,
  page: number = 1,
  pageSize: number = 12
): Promise<{ courses: any[]; count: number; hasMore: boolean }> {
  try {
    const headers = getRapidAPIHeaders();
    
    // RapidAPI endpoint - new structure
    const apiHost = process.env.RAPIDAPI_UDEMY_HOST || "udemy-paid-courses-for-free-api.p.rapidapi.com";
    const query = searchQuery && searchQuery.trim().length > 0 
      ? encodeURIComponent(searchQuery.trim()) 
      : "programming"; // Default query if empty
    
    const url = `https://${apiHost}/rapidapi/courses/search?page=${page}&page_size=${pageSize}&query=${query}`;

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`RapidAPI error ${response.status}:`, errorText);
      
      if (response.status === 401 || response.status === 403) {
        throw new Error("Invalid RapidAPI key. Please check your RAPIDAPI_KEY in environment variables.");
      }
      if (response.status === 429) {
        throw new Error("RapidAPI rate limit exceeded. Please try again later.");
      }
      
      throw new Error(`RapidAPI error: ${response.status} ${response.statusText}`);
    }

    const data: any = await response.json();
    
    // Handle different response formats for the new API
    let courses: RapidAPICourse[] = [];
    if (Array.isArray(data)) {
      courses = data;
    } else if (data && Array.isArray(data.courses)) {
      courses = data.courses;
    } else if (data && Array.isArray(data.data)) {
      courses = data.data;
    } else if (data && Array.isArray(data.results)) {
      courses = data.results;
    } else if (data && data.results && Array.isArray(data.results)) {
      courses = data.results;
    } else if (data && data.data && Array.isArray(data.data)) {
      courses = data.data;
    }

    if (courses.length === 0) {
      return {
        courses: [],
        count: 0,
        hasMore: false,
      };
    }

    // Transform courses
    const transformedCourses = courses.map((course) => {
      try {
        return transformRapidAPICourse(course);
      } catch (error) {
        console.error("Error transforming course:", error);
        return null;
      }
    }).filter((course) => course !== null);

    // Check if there are more pages
    const hasMore = courses.length >= pageSize || (data.next !== null && data.next !== undefined);

    return {
      courses: transformedCourses,
      count: data.count || courses.length,
      hasMore: hasMore,
    };
  } catch (error: any) {
    console.error("Error searching Udemy courses via RapidAPI:", error);
    throw error;
  }
}

/**
 * Get course details by ID via RapidAPI
 * Uses fallback search if direct ID lookup fails
 */
export async function getUdemyCourseDetails(courseId: string): Promise<any> {
  try {
    const headers = getRapidAPIHeaders();
    const apiHost = process.env.RAPIDAPI_UDEMY_HOST || "udemy-paid-courses-for-free-api.p.rapidapi.com";
    
    // Try to search for the course by ID - search through multiple pages
    console.log(`Searching for course ID: ${courseId}`);
    
    // Try searching with common terms and find by ID
    const searchTerms = ["programming", "development", "course", "tutorial"];
    
    for (const term of searchTerms) {
      for (let page = 1; page <= 3; page++) {
        try {
          const searchUrl = `https://${apiHost}/rapidapi/courses/search?page=${page}&page_size=50&query=${encodeURIComponent(term)}`;
          const searchResponse = await fetch(searchUrl, {
            method: "GET",
            headers,
          });

          if (searchResponse.ok) {
            const searchData: any = await searchResponse.json();
            
            let allCourses: RapidAPICourse[] = [];
            if (Array.isArray(searchData)) {
              allCourses = searchData;
            } else if (Array.isArray(searchData.courses)) {
              allCourses = searchData.courses;
            } else if (Array.isArray(searchData.data)) {
              allCourses = searchData.data;
            } else if (Array.isArray(searchData.results)) {
              allCourses = searchData.results;
            } else if (searchData.results && Array.isArray(searchData.results)) {
              allCourses = searchData.results;
            } else if (searchData.data && Array.isArray(searchData.data)) {
              allCourses = searchData.data;
            }

            // Find course by ID
            const foundCourse = allCourses.find(
              (c) => c.id?.toString() === courseId.toString()
            );

            if (foundCourse) {
              console.log(`Found course ${courseId} via search with term "${term}" on page ${page}`);
              return transformRapidAPICourse(foundCourse, true);
            }

            // If no more courses, try next search term
            if (allCourses.length === 0) {
              break;
            }
          }
        } catch (searchError) {
          console.error(`Error in search for term "${term}" page ${page}:`, searchError);
          // Continue to next page/term
        }
      }
    }

    // If we still haven't found it, throw error
    throw new Error("Course not found");
  } catch (error: any) {
    console.error("Error fetching Udemy course details via RapidAPI:", error);
    if (error.message === "Course not found") {
      throw error;
    }
    throw new Error(`Failed to fetch course details: ${error.message}`);
  }
}

/**
 * Get courses by category via RapidAPI
 */
export async function getUdemyCoursesByCategory(
  category: string,
  page: number = 1,
  pageSize: number = 12
): Promise<{ courses: any[]; count: number; hasMore: boolean }> {
  try {
    // For RapidAPI, we'll use search with category as query
    return await searchUdemyCourses(category, page, pageSize);
  } catch (error: any) {
    console.error("Error fetching Udemy courses by category via RapidAPI:", error);
    throw error;
  }
}

/**
 * Transform RapidAPI course to our standardized format
 */
function transformRapidAPICourse(course: RapidAPICourse, includeFullDetails: boolean = false): any {
  const instructor = course.visible_instructors?.[0] || {
    name: course.instructor_name || course.instructor || "Udemy Instructor",
    display_name: course.instructor_name || course.instructor || "Udemy Instructor",
  };

  const durationHours = course.content_length_video
    ? Math.round(course.content_length_video / 3600 * 10) / 10
    : course.duration
    ? course.duration
    : 0;

  const durationText = durationHours > 0 
    ? `${durationHours} hours` 
    : course.content_length_video
    ? formatDuration(course.content_length_video)
    : "N/A";

  const thumbnail = course.image_750x422 || 
                    course.image_480x270 || 
                    course.pic || 
                    "/placeholder-course.png";

  const courseUrl = course.coupon || 
                    course.url || 
                    course.link || 
                    `https://www.udemy.com/course/${course.id}/`;

  const price = course.price || course.price_detail?.price_string || "Free";
  const originalPrice = course.org_price || 
                       (course.price_detail?.amount ? `$${(course.price_detail.amount * 1.5).toFixed(2)}` : undefined);

  const baseCourse = {
    id: course.id.toString(),
    title: course.title || "Untitled Course",
    instructor: instructor.display_name || instructor.name,
    instructorName: instructor.name,
    instructorJobTitle: instructor.job_title || "",
    instructorImage: instructor.image_100x100 || instructor.image_50x50 || "",
    instructorUrl: instructor.url || "",
    rating: course.rating || 0,
    numReviews: 0, // RapidAPI might not provide this
    students: course.num_subscribers || course.num_students || 0,
    price: price,
    originalPrice: originalPrice,
    thumbnail: thumbnail,
    url: courseUrl,
    description: course.headline || course.desc_text || course.description || "",
    level: course.level || course.category || "All Levels",
    duration: durationText,
    language: course.language || "English",
    category: course.category || "",
    subcategory: "",
    numLectures: 0, // RapidAPI might not provide this
    numQuizzes: 0,
    numPracticeTests: 0,
    contentInfo: "",
    isPaid: course.price ? course.price !== "Free" : false,
    created: course.created || "",
    lastUpdate: course.last_update_date || course.created || "",
  };

  if (includeFullDetails) {
    return {
      ...baseCourse,
      fullDescription: course.description || course.desc_text || course.headline || "",
      objectives: course.objectives || [],
      requirements: course.requirements || [],
      whatYouWillLearn: course.what_you_will_learn || [],
      targetAudiences: course.target_audiences || [],
      allInstructors: course.visible_instructors || [instructor],
    };
  }

  return baseCourse;
}

/**
 * Format duration from seconds to readable string
 */
function formatDuration(seconds: number): string {
  if (!seconds || seconds === 0) return "N/A";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ${minutes > 0 ? `${minutes} min${minutes > 1 ? "s" : ""}` : ""}`.trim();
  }
  return `${minutes} min${minutes > 1 ? "s" : ""}`;
}
