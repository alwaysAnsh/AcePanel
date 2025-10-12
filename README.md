## Intervuex – AI-Powered Interview Platform

Intervuex is a platform for scheduling, managing, and recording interviews. It is built with Next.js, TailwindCSS, and Convex, and provides a seamless experience for both candidates and interviewers.

## Getting Started

First, clone the repository and install dependencies:

git clone <repo_url>
cd intervuex
npm install


## Start the development server:

npx next dev
# or
npm run dev


Open http://localhost:3000
 in your browser to see the app. The page will auto-update as you edit files.

## Features

Schedule interviews with candidates and interviewers.

Create, view, and delete interviews (only creator can delete).

Track interview status: upcoming, live, completed.

Join live meetings and record sessions.

Display first names of interviewers; multiple interviewers separated by commas.

## Tech Stack

Frontend: Next.js (App Router), React, TailwindCSS v4, TypeScript

Backend: Convex (Serverless DB + Functions)

Authentication: Clerk (candidate/interviewer roles)

Deployment: Vercel

Environment Variables

Create a .env file in the root with:

CLERK_FRONTEND_API=<your-clerk-frontend-api>
CONVEX_URL=<your-convex-deployment-url>
NEXT_PUBLIC_APP_URL=http://localhost:3000

## Notes

Only the interview creator can delete meetings.

Meeting status auto-updates based on startTime.

For support or questions, contact: anshj9y@gmail.com

## Learn More

Next.js Documentation
 – learn about Next.js features.

TailwindCSS Documentation
 – learn about styling utilities.

Clerk Documentation
 – learn about authentication and roles.

Convex Documentation
 – learn about serverless database and functions.
