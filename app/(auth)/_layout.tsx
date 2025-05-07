import { COLORS } from '@/constants/theme'
import { Stack } from 'expo-router'
import { Platform } from 'react-native'

export default function AuthLayout() {
  return (
    <Stack 
      screenOptions={{
        headerShown: false,
        contentStyle: { 
          backgroundColor: COLORS.background,
          // Configuraciones específicas para Android
          ...(Platform.OS === 'android' && {
            flex: 1,
            position: 'relative',
            zIndex: 1
          })
        },
        animation: 'fade'
      }}
    />
  )
}