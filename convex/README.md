# Convex Backend for Social Media App

This directory contains the Convex functions and schema for the Social Media Mobile App.

## Overview

[Convex](https://www.convex.dev/) is a backend platform that provides a real-time database, serverless functions, and automatic syncing with your React Native frontend.

## Features

- **Real-time data**: All database changes sync automatically to connected clients
- **TypeScript support**: Fully typed API for better development experience
- **Authentication**: Integration with Clerk for secure user authentication
- **Serverless functions**: Query and mutation functions for data operations

## Schema & Data Model

The database schema includes:

- **Users**: User profiles and account information
- **Posts**: Social media posts with text, images, likes, etc.
- **Comments**: User comments on posts
- **Bookmarks**: Saved posts for users
- **Notifications**: User notifications for interactions

## Available Functions

### Posts
- Create, read, update, and delete posts
- Like/unlike posts
- Get feed based on following

### Users
- User profile management
- Following/unfollowing users
- User search

### Comments
- Add comments to posts
- Like/unlike comments
- Get comments for a post

### Bookmarks
- Save/unsave posts
- Retrieve bookmarked posts

### Notifications
- Create notifications
- Mark notifications as read
- Get user notifications

## Getting Started

1. **Set up Convex**
   ```bash
   npx convex dev
   ```

2. **Configure environment variables**
   Create a `.env` file with your Convex and Clerk credentials

3. **Run with the frontend**
   Start both the Convex dev server and the React Native app

## Documentation

For more information on how to use Convex:
- [Convex Documentation](https://docs.convex.dev/)
- [TypeScript with Convex](https://docs.convex.dev/typescript)
- [Authentication](https://docs.convex.dev/auth)
- [Database queries](https://docs.convex.dev/database/reading-data)
- [Database mutations](https://docs.convex.dev/database/writing-data)

## Development Workflow

1. Define your schema in `schema.ts`
2. Create query and mutation functions in appropriate files
3. Generate types with `npx convex dev`
4. Import and use functions in your React Native app
