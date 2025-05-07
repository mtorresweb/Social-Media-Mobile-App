import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { getAuthenticatedUser } from './users'

export const toggleBookmark = mutation({
  args: { postId: v.id('posts') },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx)

    //get all bookmarks
    const existing = await ctx.db
      .query('bookmarks')
      .withIndex('by_user_and_post', (q) =>
        q.eq('userId', currentUser._id).eq('postId', args.postId)
      )
      .first()

    if (existing) {
      await ctx.db.delete(existing._id)
      return false // Bookmark removed
    } else {
      await ctx.db.insert('bookmarks', {
        userId: currentUser._id,
        postId: args.postId,
      })
      return true // Bookmark added
    }
  },
})

export const getBookmarkedPosts = query({
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx)

    // Get all bookmarks of the current user
    const bookmarks = await ctx.db
      .query('bookmarks')
      .withIndex('by_user', (q) => q.eq('userId', currentUser._id))
      .order('desc')
      .collect()

    // Fetch post details for each bookmark
    const bookmarksWithInfo = await Promise.all(
      bookmarks.map(async (bookmark) => {
        const post = await ctx.db.get(bookmark.postId)
        if (!post) return null // Handle deleted posts
        
        // Get author information
        const author = await ctx.db.get(post.userId)
        if (!author) return null // Skip if author doesn't exist
        
        // Check if the current user has liked the post
        const like = await ctx.db
          .query('likes')
          .withIndex('by_user_and_post', (q) =>
            q.eq('userId', currentUser._id).eq('postId', bookmark.postId)
          )
          .first()
        
        // Enhance post with additional information
        return {
          ...post,
          isLiked: !!like,
          isBookmarked: true, // It's a bookmark by definition
          author: {
            _id: author._id,
            username: author.username,
            image: author.image,
          },
        }
      })
    )

    // Filter out any null values (deleted posts)
    return bookmarksWithInfo.filter(post => post !== null)
  },
})
