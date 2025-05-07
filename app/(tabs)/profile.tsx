import { Loader } from '@/components/Loader'
import Post from '@/components/Post'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useAuth } from '@clerk/clerk-expo'
import { useQuery, useMutation } from 'convex/react'
import { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  TextInput,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/theme'
import { styles } from '@/styles/profile.styles'
import { Image } from 'expo-image'

const { width } = Dimensions.get('window')
const NUM_COLUMNS = 3
const GRID_ITEM_SIZE = width / NUM_COLUMNS - 2

// Define the post type to match what Post component expects
type PostType = {
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

export default function Profile() {
  const { signOut, userId } = useAuth()
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null)

  // Fetch user data
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    userId ? { clerkId: userId } : 'skip'
  )

  // Fetch feed posts to get full post data
  const feedPosts = useQuery(api.posts.getFeedPosts)
  const userPosts = useQuery(api.posts.getPostsByUser, {})

  // Handle profile editing state
  const [editedProfile, setEditedProfile] = useState({
    fullname: '',
    bio: '',
  })

  // Update form data when user data is loaded
  useEffect(() => {
    if (currentUser) {
      setEditedProfile({
        fullname: currentUser.fullname || '',
        bio: currentUser.bio || '',
      })
    }
  }, [currentUser])

  // Mutation to update profile
  const updateProfile = useMutation(api.users.updateProfile)

  // Handle saving profile
  const handleSaveProfile = async () => {
    await updateProfile(editedProfile)
    setIsEditModalVisible(false)
  }

  // Show loader if data is still loading
  if (!currentUser || !userPosts || !feedPosts) return <Loader />

  // Get enhanced posts with full details
  const posts = userPosts.map(post => {
    // Try to find the full post data in feedPosts
    const fullPost = feedPosts.find(fp => fp._id === post._id)
    
    // If found, use that data, otherwise use a default structure
    return fullPost || {
      ...post,
      isLiked: false,
      isBookmarked: false,
      author: {
        _id: currentUser._id,
        username: currentUser.username,
        image: currentUser.image
      }
    }
  }) as PostType[]

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.username}>{currentUser.username}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => signOut()}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          {/* AVATAR & STATS */}
          <View style={styles.avatarAndStats}>
            <View style={styles.avatarContainer}>
              <Image
                source={currentUser.image}
                style={styles.avatar}
                contentFit="cover"
                transition={200}
              />
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{currentUser.posts}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{currentUser.followers}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{currentUser.following}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>

          {/* USERNAME & BIO */}
          <Text style={styles.name}>{currentUser.fullname}</Text>
          {currentUser.bio && <Text style={styles.bio}>{currentUser.bio}</Text>}

          {/* ACTION BUTTONS */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditModalVisible(true)}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* POSTS SECTION */}
        {posts.length === 0 ? (
          <NoPostsFound />
        ) : (
          <View style={styles.postsGrid}>
            <FlatList
              data={posts}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.gridItem}
                  onPress={() => setSelectedPost(item)}
                >
                  <Image
                    source={item.imageUrl}
                    style={[styles.gridImage, { width: GRID_ITEM_SIZE, height: GRID_ITEM_SIZE }]}
                    contentFit="cover"
                  />
                </TouchableOpacity>
              )}
              numColumns={NUM_COLUMNS}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>

      {/* Post Detail Modal */}
      {selectedPost && (
        <Modal
          visible={!!selectedPost}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSelectedPost(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.postDetailContainer}>
              <View style={styles.postDetailHeader}>
                <TouchableOpacity onPress={() => setSelectedPost(null)}>
                  <Ionicons name="close" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>
              <ScrollView>
                <Post post={selectedPost} />
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.fullname}
                  onChangeText={(text) =>
                    setEditedProfile((prev) => ({ ...prev, fullname: text }))
                  }
                  placeholderTextColor={COLORS.grey}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.bioInput]}
                  value={editedProfile.bio}
                  onChangeText={(text) =>
                    setEditedProfile((prev) => ({ ...prev, bio: text }))
                  }
                  multiline
                  numberOfLines={4}
                  placeholderTextColor={COLORS.grey}
                />
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

function NoPostsFound() {
  return (
    <View style={styles.noPostsContainer}>
      <Ionicons name="images-outline" size={48} color={COLORS.primary} />
      <Text style={styles.noPostsText}>No posts yet</Text>
    </View>
  )
}
