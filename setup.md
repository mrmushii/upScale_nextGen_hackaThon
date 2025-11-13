# Resources Feature Setup Guide

This guide will help you set up the Resources feature for job seekers, including Udemy API integration, YouTube API integration, and course progress tracking.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [API Keys Setup](#api-keys-setup)
4. [Database Setup](#database-setup)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 18+ installed
- MongoDB database configured
- Next.js application running
- Git repository access

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# YouTube Data API v3
YOUTUBE_API_KEY=your_youtube_api_key_here

# RapidAPI for Udemy (Required for real Udemy courses)
RAPIDAPI_KEY=your_rapidapi_key_here
UDEMY_API_HOST=udemy-api.p.rapidapi.com

# MongoDB (if not already configured)
MONGODB_URI=your_mongodb_connection_string

# Existing environment variables
GEMINI_API_KEY=your_gemini_api_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## API Keys Setup

### 1. YouTube Data API v3 Setup

The YouTube API is used to fetch courses from FreeCodeCamp and JavaScriptMastery channels.

#### Steps:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project** (or select existing)
   - Click on the project dropdown at the top
   - Click "New Project"
   - Enter project name: "Upscale Resources"
   - Click "Create"

3. **Enable YouTube Data API v3**
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click on it and click "Enable"

4. **Create Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key
   - (Optional) Click "Restrict Key" to limit usage:
     - Under "API restrictions", select "Restrict key"
     - Choose "YouTube Data API v3"
     - Save

5. **Add to Environment Variables**
   ```env
   YOUTUBE_API_KEY=AIzaSy...your_key_here
   ```

#### YouTube API Quotas:
- Default quota: 10,000 units per day
- Search request: 100 units
- Video details request: 1 unit
- You can request quota increase if needed

### 2. RapidAPI Udemy API Setup (Recommended)

The Udemy integration now uses RapidAPI. Follow these steps:

1. **Sign up for RapidAPI**
   - Visit: https://rapidapi.com/
   - Create an account (free tier available)

2. **Subscribe to Udemy API**
   - Go to RapidAPI Marketplace: https://rapidapi.com/marketplace
   - Search for "Udemy" or "Udemy API"
   - Choose a Udemy API provider (examples: "Udemy API" by RapidAPI, "Udemy Courses" by various providers)
   - Click "Subscribe" and choose a plan (Basic plan is usually sufficient for testing)
   - Copy your **X-RapidAPI-Key** from the dashboard

3. **Get API Host**
   - In the API documentation page, note the **Host** value
   - Common hosts: `udemy-api.p.rapidapi.com`, `udemy-courses.p.rapidapi.com`
   - The default host is `udemy-api.p.rapidapi.com` but check your specific API provider

4. **Add to Environment Variables**
   ```env
   RAPIDAPI_KEY=your_rapidapi_key_here
   UDEMY_API_HOST=udemy-api.p.rapidapi.com
   ```

5. **Test the API**
   - The API route will automatically use RapidAPI if `RAPIDAPI_KEY` is configured
   - If the API key is missing, it will fallback to mock data
   - Check the API documentation for the exact endpoint structure (may vary by provider)

**Note**: The implementation handles multiple response formats from different RapidAPI Udemy providers. If you encounter issues, check:
- The API endpoint structure in your provider's documentation
- The response format (the code handles `results`, `courses`, or direct array formats)
- Your API quota/limits in RapidAPI dashboard

## Database Setup

The Resources feature uses a new `CourseProgress` model. MongoDB will automatically create the collection when you first use it.

### Verify Database Connection

1. Ensure your MongoDB connection is working:
   ```bash
   # Check your .env.local file has:
   MONGODB_URI=mongodb://localhost:27017/upscale
   # or your MongoDB Atlas connection string
   ```

2. The `CourseProgress` model will be created automatically on first use.

### Database Indexes

The following indexes are automatically created:
- `userId` index for fast user queries
- Compound index `(userId, courseId)` for unique progress records

## Testing

### 1. Test YouTube API

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/dashboard/resources`

3. Click on the "YouTube" tab

4. You should see courses from FreeCodeCamp and JavaScriptMastery channels

5. Click on a course to open the video player

6. Watch a video and check if progress is being tracked

### 2. Test Udemy API

1. Navigate to: `http://localhost:3000/dashboard/resources`

2. Click on the "Udemy" tab

3. You should see Udemy courses (mock data if API not configured)

4. Click "View on Udemy" to open course in new tab

### 3. Test Course Suggestions

1. Generate a roadmap first:
   - Go to `/dashboard/roadmap`
   - Click "Generate My Roadmap"

2. Navigate to: `/dashboard/resources`

3. Click on the "Suggested" tab

4. You should see courses suggested based on your current roadmap stage

### 4. Test Progress Tracking

1. Open a YouTube course video

2. Watch for a few seconds

3. Close the video player

4. Reopen the same video - it should resume from where you left off

5. Check the progress bar on the course card

## Features Overview

### 1. Resources Page (`/dashboard/resources`)

- **All Courses Tab**: Shows all available courses from both Udemy and YouTube
- **Suggested Tab**: Shows courses recommended based on your active roadmap
- **Udemy Tab**: Shows only Udemy courses
- **YouTube Tab**: Shows only YouTube courses from FreeCodeCamp and JavaScriptMastery

### 2. Course Types

#### Udemy Courses
- Display course information (title, instructor, rating, price)
- Click "View on Udemy" to open course in new tab
- Progress tracking (if user visits Udemy and marks complete)

#### YouTube Courses
- Embedded video player within the website
- Progress tracking with timestamps
- Resume from last watched position
- Progress bar showing completion percentage

### 3. Progress Tracking

- Tracks progress for both Udemy and YouTube courses
- Stores last watched timestamp for YouTube videos
- Marks courses as completed when 90%+ watched
- Progress is synced across devices (same user account)

### 4. Roadmap Integration

- Roadmap generator suggests relevant courses for each stage
- Suggested courses appear in the "Suggested" tab
- Courses are filtered based on:
  - User's preferred track
  - User's skills
  - Current roadmap stage

## API Endpoints

### GET `/api/resources/udemy`
Fetches Udemy courses filtered by user preferences.

**Response:**
```json
{
  "courses": [
    {
      "id": "udemy-1",
      "title": "Course Title",
      "instructor": "Instructor Name",
      "rating": 4.6,
      "students": 125000,
      "price": "$89.99",
      "thumbnail": "url",
      "url": "udemy_course_url",
      "description": "Course description",
      "level": "Beginner to Advanced",
      "duration": "45 hours"
    }
  ]
}
```

### GET `/api/resources/youtube`
Fetches YouTube courses from FreeCodeCamp and JavaScriptMastery channels.

**Response:**
```json
{
  "courses": [
    {
      "id": "video-id",
      "videoId": "youtube_video_id",
      "title": "Video Title",
      "description": "Video description",
      "thumbnail": "thumbnail_url",
      "channel": "FreeCodeCamp",
      "duration": 10800,
      "durationFormatted": "3:00:00",
      "viewCount": 5000000,
      "url": "youtube_url"
    }
  ]
}
```

### GET `/api/resources/suggest`
Fetches course suggestions based on user's active roadmap.

**Response:**
```json
{
  "suggestions": {
    "stageName": "Stage Name",
    "udemyCourses": [...],
    "youtubeCourses": [...],
    "message": "Based on your current roadmap stage..."
  }
}
```

### GET `/api/resources/progress`
Fetches user's course progress.

**Response:**
```json
{
  "progress": [
    {
      "courseId": "course-id",
      "courseType": "youtube",
      "courseTitle": "Course Title",
      "progress": 45,
      "lastWatchedTimestamp": 1800,
      "completed": false
    }
  ]
}
```

### POST `/api/resources/progress`
Updates course progress.

**Request Body:**
```json
{
  "courseId": "course-id",
  "courseType": "youtube",
  "courseTitle": "Course Title",
  "videoId": "youtube_video_id",
  "progress": 45,
  "lastWatchedTimestamp": 1800,
  "duration": 3600
}
```

## Troubleshooting

### YouTube API Issues

**Problem**: "YouTube API key not configured" error

**Solution**:
1. Check that `YOUTUBE_API_KEY` is set in `.env.local`
2. Restart your development server after adding the key
3. Verify the API key is correct in Google Cloud Console

**Problem**: "Quota exceeded" error

**Solution**:
1. Check your quota usage in Google Cloud Console
2. Request quota increase if needed
3. Implement caching to reduce API calls

### Udemy API Issues

**Problem**: No courses showing (using mock data)

**Solution**:
1. This is expected if Udemy API keys are not configured
2. Configure RapidAPI or Udemy Affiliate API (see Udemy API Setup)
3. Update the API route to use real API endpoints

### Progress Not Saving

**Problem**: Video progress not being tracked

**Solution**:
1. Check browser console for errors
2. Verify MongoDB connection
3. Check that user is authenticated
4. Verify API route `/api/resources/progress` is accessible

### Video Player Not Loading

**Problem**: YouTube video player not showing

**Solution**:
1. Check that YouTube IFrame API is loading (check browser console)
2. Verify video ID is correct
3. Check for CORS issues
4. Ensure YouTube API key has proper permissions

## Production Deployment

### 1. Environment Variables

Add all environment variables to your production hosting platform:
- Vercel: Project Settings > Environment Variables
- Netlify: Site Settings > Environment Variables
- Heroku: Config Vars

### 2. API Rate Limits

- Implement caching for YouTube API calls
- Consider using a CDN for course thumbnails
- Monitor API usage in Google Cloud Console

### 3. Database

- Ensure MongoDB is accessible from production
- Set up database backups
- Monitor database performance

### 4. Security

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Implement rate limiting on API routes
- Validate user authentication on all endpoints

## Additional Resources

- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
- [RapidAPI Udemy API](https://rapidapi.com/marketplace)
- [Udemy Affiliate Program](https://www.udemy.com/affiliate/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review API documentation
3. Check browser console for errors
4. Verify all environment variables are set correctly

---

**Last Updated**: 2024
**Version**: 1.0.0

