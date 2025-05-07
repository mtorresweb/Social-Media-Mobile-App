import { View, Text, TouchableOpacity, Modal, ScrollView, Dimensions, FlatList } from 'react-native'
import React, { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Loader } from '@/components/Loader'
import { COLORS } from '@/constants/theme'
import { styles } from '@/styles/feed.styles'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import Post from '@/components/Post'
import { Id } from '@/convex/_generated/dataModel'

const { width } = Dimensions.get('window')
const NUM_COLUMNS = 3
const GRID_ITEM_SIZE = width / NUM_COLUMNS - 2

// Define post type
type BookmarkedPostType = {
  _id: Id<'posts'>;
  imageUrl: string;
  caption?: string;
  likes: number;
  comments: number;
  _creationTime: number;
  isLiked: boolean;
  isBookmarked: boolean;
  author: {
    _id: string;
    username: string;
    image: string;
  };
  userId?: Id<'users'>;
  storageId?: Id<'_storage'>;
};

export default function Bookmarks() {
  const [selectedPost, setSelectedPost] = useState<BookmarkedPostType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Fetch bookmarked posts
  const bookmarkedPosts = useQuery(api.bookmarks.getBookmarkedPosts)

  const openPostDetails = (post: BookmarkedPostType) => {
    setSelectedPost(post)
    setIsModalOpen(true)
  }

  const closePostDetails = () => {
    setIsModalOpen(false)
    setSelectedPost(null)
  }

  // Handle unbookmark event
  const handleUnbookmark = () => {
    closePostDetails()
  }

  if (bookmarkedPosts === undefined) return <Loader />
  if (bookmarkedPosts.length === 0) return <NoBookmarksFound />

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookmarks</Text>
      </View>

      {/* POSTS GRID */}
      <FlatList
        data={bookmarkedPosts}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ margin: 1, width: GRID_ITEM_SIZE, height: GRID_ITEM_SIZE }}
            onPress={() => openPostDetails(item)}
          >
            <Image
              source={item.imageUrl}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
          </TouchableOpacity>
        )}
        numColumns={NUM_COLUMNS}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 1 }}
      />

      {/* Post Detail Modal */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={closePostDetails}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.postDetailContainer}>
            <View style={styles.postDetailHeader}>
              <TouchableOpacity onPress={closePostDetails}>
                <Ionicons name="close" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {selectedPost && (
                <Post 
                  post={selectedPost} 
                  onUnbookmark={handleUnbookmark}
                />
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

function NoBookmarksFound() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
      }}
    >
      <Text style={{ color: COLORS.primary, fontSize: 22 }}>
        No Bookmarked posts
      </Text>
    </View>
  )
}
