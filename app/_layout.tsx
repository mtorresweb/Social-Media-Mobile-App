import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import InitialLayout from '@/components/InitialLayout'
import ClerkAndConvexProvider from '@/providers/ClerkAndConvexProvider'
import { SplashScreen } from 'expo-router'
import { useFonts } from 'expo-font'
import { useCallback, useEffect } from 'react'
import { StatusBar, View, Platform } from 'react-native'
import { COLORS } from '@/constants/theme'

// Prevent auto-hiding the splash screen
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'JetBrainsMono-Medium': require('../assets/fonts/JetBrainsMono-Medium.ttf'),
  })

  useEffect(() => {
    // Hide splash screen on font load error or when fonts are loaded
    if (fontError) {
      console.error("Font loading error:", fontError);
      SplashScreen.hideAsync();
    }
  }, [fontError]);

  useEffect(() => {
    // Hide splash screen when fonts are loaded
    if (fontsLoaded) {
      // Use a short timeout for Android to ensure everything is ready
      if (Platform.OS === 'android') {
        setTimeout(() => {
          SplashScreen.hideAsync().catch(e => console.log('Error hiding splash screen:', e));
        }, 200);
      } else {
        SplashScreen.hideAsync().catch(e => console.log('Error hiding splash screen:', e));
      }
    }
  }, [fontsLoaded]);

  // Don't render anything until the fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ClerkAndConvexProvider>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <SafeAreaProvider>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: COLORS.background }}
        >
          <InitialLayout />
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkAndConvexProvider>
  )
}
