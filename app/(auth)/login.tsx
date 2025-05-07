import { COLORS } from '@/constants/theme'
import { styles } from '@/styles/auth.styles'
import { useSSO } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { View, Text, Image, TouchableOpacity, Platform, StatusBar } from 'react-native'
import { useState, useEffect } from 'react'

export default function login() {
  const { startSSOFlow } = useSSO()
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)

  // Agregar un efecto para asegurarnos de que los elementos se carguen correctamente
  useEffect(() => {
    // Pequeño retraso para asegurar que los componentes se rendericen correctamente en Android
    const timer = setTimeout(() => {
      setLoaded(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  const handleGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
      })
      if (setActive && createdSessionId) {
        setActive({ session: createdSessionId })
        // Fix the navigation path format for Expo Router v5+
        router.replace('/(tabs)')
      }
    } catch (error) {
      console.error('OAuth error:', error)
    }
  }

  return (
    <View style={[styles.container, { opacity: loaded ? 1 : (Platform.OS === 'android' ? 0.99 : 1) }]}>
      {/* Asegurar que la barra de estado tenga el color correcto en Android */}
      <StatusBar 
        backgroundColor={COLORS.background} 
        barStyle="light-content" 
      />
      
      <View style={styles.brandSection}>
        <Image
          source={require('../../assets/images/icon.png')}
          style={{
            width: 32,
            height: 32,
          }}
          resizeMode="cover"
        />
        <Text style={styles.appName}>spotlight</Text>
        <Text style={styles.tagline}>don't miss anything</Text>
      </View>

      {/*Illustration */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require('../../assets/images/auth-illustration.png')}
          style={styles.illustration}
          resizeMode="cover"
        />

        {/*Login section */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          activeOpacity={0.9}
        >
          <View style={styles.googleIconContainer}>
            <Ionicons name="logo-google" size={20} color={COLORS.surface} />
          </View>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By continuing, you agree to our Terms and Privacy Policy
        </Text>
      </View>
    </View>
  )
}
