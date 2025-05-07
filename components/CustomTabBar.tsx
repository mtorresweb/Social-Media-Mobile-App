import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useRouter, usePathname } from 'expo-router';

const { width } = Dimensions.get('window');

export default function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  // No renderizar en iOS o en pantallas que no sean de tabs
  if (Platform.OS !== 'android' || !pathname.includes('(tabs)')) {
    return null;
  }

  const isActive = (route: string) => {
    return pathname.includes(route);
  };

  // Definir rutas tipadas correctamente para Expo Router v5
  const navigateToHome = () => {
    router.replace('/(tabs)');
  };

  const navigateToBookmarks = () => {
    router.replace('/(tabs)/bookmarks');
  };

  const navigateToCreate = () => {
    router.replace('/(tabs)/create');
  };

  const navigateToNotifications = () => {
    router.replace('/(tabs)/notifications');
  };

  const navigateToProfile = () => {
    router.replace('/(tabs)/profile');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.tabButton} 
        onPress={navigateToHome}
        accessibilityLabel="Home"
      >
        <Ionicons 
          name="home" 
          size={24} 
          color={isActive('index') ? COLORS.primary : COLORS.grey} 
        />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tabButton} 
        onPress={navigateToBookmarks}
        accessibilityLabel="Bookmarks"
      >
        <Ionicons 
          name="bookmark" 
          size={24} 
          color={isActive('bookmarks') ? COLORS.primary : COLORS.grey} 
        />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tabButton} 
        onPress={navigateToCreate}
        accessibilityLabel="Create"
      >
        <Ionicons 
          name="add-circle" 
          size={30} 
          color={COLORS.primary} 
        />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tabButton} 
        onPress={navigateToNotifications}
        accessibilityLabel="Notifications"
      >
        <Ionicons 
          name="heart" 
          size={24} 
          color={isActive('notifications') ? COLORS.primary : COLORS.grey} 
        />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tabButton} 
        onPress={navigateToProfile}
        accessibilityLabel="Profile"
      >
        <Ionicons 
          name="person-circle" 
          size={24} 
          color={isActive('profile') ? COLORS.primary : COLORS.grey} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: 60,
    backgroundColor: COLORS.background,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: COLORS.surface,
    paddingBottom: 8,
    zIndex: 999,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  }
});