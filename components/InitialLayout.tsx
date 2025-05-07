import { useAuth } from '@clerk/clerk-expo'
import { Slot, useRouter, useSegments } from 'expo-router'
import { useEffect, useState } from 'react'
import { Platform, View, ActivityIndicator, Text } from 'react-native'
import { COLORS } from '@/constants/theme'

export default function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth()
  const segments = useSegments()
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // For debugging purposes
    console.log("InitialLayout mounted");
    console.log("Auth state:", { isLoaded, isSignedIn });
    console.log("Current segments:", segments);

    if (!isLoaded) return

    // Determine where we should be
    const inAuthScreen = segments[0] === '(auth)'
    
    // Only navigate if we're in the wrong place
    const shouldNavigateToAuth = !isSignedIn && !inAuthScreen
    const shouldNavigateToApp = isSignedIn && inAuthScreen

    // Don't do anything if we're already where we should be
    if (!shouldNavigateToAuth && !shouldNavigateToApp) {
      console.log("Already in the correct place, no navigation needed");
      return;
    }

    // Don't navigate if we're already navigating
    if (isNavigating) return;

    // Start navigation
    setIsNavigating(true);
    
    try {
      // Use a longer timeout for Android to ensure proper navigation
      setTimeout(() => {
        if (shouldNavigateToAuth) {
          console.log("Navigating to auth");
          router.replace('/(auth)/login');
        } else if (shouldNavigateToApp) {
          console.log("Navigating to app");
          router.replace('/(tabs)');
        }
        
        // Reset navigation flag after a delay to ensure navigation completed
        setTimeout(() => {
          setIsNavigating(false);
        }, 500);
      }, Platform.OS === 'android' ? 500 : 100);
    } catch (e) {
      console.error("Navigation error:", e);
      setError(`Navigation error: ${e}`);
      setIsNavigating(false);
    }
  }, [isLoaded, isSignedIn, segments, router, isNavigating])

  // Show loading or error states
  if (!isLoaded || isNavigating) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ color: COLORS.primary, marginTop: 20 }}>
          {isLoaded ? 'Preparing app...' : 'Loading...'}
        </Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <Text style={{ color: 'red', textAlign: 'center', margin: 20 }}>{error}</Text>
      </View>
    )
  }

  // Default case: render the app
  return <Slot />
}
