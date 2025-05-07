import { COLORS } from '@/constants/theme'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { styles } from '@/styles/feed.styles'
import { Ionicons } from '@expo/vector-icons'
import { useMutation, useQuery } from 'convex/react'
import { Image } from 'expo-image'
import { Link, usePathname } from 'expo-router'
import { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import CommentsModal from './CommentsModal'
import { formatDistanceToNow } from 'date-fns'
import { useUser } from '@clerk/clerk-expo'

type PostProps = {
  post: {
    _id: Id<'posts'>
    imageUrl: string
    caption?: string
    likes: number
    comments: number
    _creationTime: number
    isLiked: boolean
    isBookmarked: boolean
    author: {
      _id: string
      username: string
      image: string
    }
  }
  onUnbookmark?: () => void
}

export default function Post({ post, onUnbookmark }: PostProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked)
  const [showComments, setShowComments] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes)
  const [commentsCount, setCommentsCount] = useState(post.comments)

  const { user } = useUser()
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user.id } : 'skip'
  )
  
  const pathname = usePathname()
  const isBookmarksPage = pathname.includes('bookmarks')

  // Update local states when post data changes
  useEffect(() => {
    setLikesCount(post.likes)
    setCommentsCount(post.comments)
    setIsLiked(post.isLiked)
    setIsBookmarked(post.isBookmarked)
  }, [post.likes, post.comments, post.isLiked, post.isBookmarked])

  const toggleLike = useMutation(api.posts.toggleLike)
  const toggleBookmark = useMutation(api.bookmarks.toggleBookmark)
  const deletePost = useMutation(api.posts.deletePost)

  const handleLike = async () => {
    try {
      const newIsLiked = await toggleLike({ postId: post._id })
      setLikesCount(prevCount => newIsLiked ? prevCount + 1 : prevCount - 1)
      setIsLiked(newIsLiked)
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleBookmark = async () => {
    try {
      const wasBookmarked = isBookmarked
      const newIsBookmarked = await toggleBookmark({ postId: post._id })
      setIsBookmarked(newIsBookmarked)
      
      if (isBookmarksPage && wasBookmarked && !newIsBookmarked && onUnbookmark) {
        onUnbookmark()
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await deletePost({ postId: post._id })
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const handleCommentAdded = () => {
    setCommentsCount(prevCount => prevCount + 1)
  }

  return (
    <View style={styles.post}>
      {/* POST HEADER */}
      <View style={styles.postHeader}>
        <Link
          href={
            currentUser?._id === post.author._id
              ? '/(tabs)/profile'
              : `./user/${post.author._id}`
          }
          asChild
        >
          <TouchableOpacity style={styles.postHeaderLeft}>
            <Image
              source={post.author.image}
              style={styles.postAvatar}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
            <Text style={styles.postUsername}>{post.author.username}</Text>
          </TouchableOpacity>
        </Link>

        {post.author._id === currentUser?._id ? (
          <TouchableOpacity onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity>
            <Ionicons
              name="ellipsis-horizontal"
              size={20}
              color={COLORS.white}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* IMAGE */}
      <Image
        source={post.imageUrl}
        style={styles.postImage}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />

      {/* POST ACTIONS */}
      <View style={styles.postActions}>
        <View style={styles.postActionsLeft}>
          <TouchableOpacity style={styles.postActionsLeft} onPress={handleLike}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={24}
              color={isLiked ? COLORS.primary : COLORS.white}
            />
            <Text style={styles.likesText}>
              {likesCount.toLocaleString()} likes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.postActionsLeft} onPress={() => setShowComments(true)}>
            <Ionicons
              name="chatbubble-outline"
              size={22}
              color={COLORS.white}
            />
            {commentsCount > 0 && (
              <Text style={styles.commentsText}>
                {commentsCount} comments
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleBookmark}>
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>

      {/* POST INFO */}
      <View style={styles.postInfo}>
        {post.caption && (
          <View style={styles.captionContainer}>
            <Text style={styles.captionUsername}>{post.author.username}</Text>
            <Text style={styles.captionText}>{post.caption}</Text>
          </View>
        )}

        <Text style={styles.timeAgo}>
          {formatDistanceToNow(post._creationTime, { addSuffix: true })}
        </Text>
      </View>

      <CommentsModal
        postId={post._id}
        visible={showComments}
        onClose={() => setShowComments(false)}
        onCommentAdded={handleCommentAdded}
      />
    </View>
  )
}
