import { Redirect } from 'expo-router'
import { Platform } from 'react-native'

export default function Index() {
  // Utilizamos una ruta que funcione bien en ambas plataformas
  return <Redirect href="/(auth)/login" />
}
