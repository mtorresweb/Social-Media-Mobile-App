# Social Media Mobile App

A modern, feature-rich social media mobile application built with React Native and Expo, powered by Convex backend.

![Social Media App](./assets/images/icon.png)

## Features

- User authentication with Clerk
- Feed with posts and stories
- Comments and interactions
- Bookmarks system
- Notifications
- User profiles
- Real-time updates with Convex

## Technology Stack

- **Frontend**: React Native, Expo Router, TypeScript
- **Backend**: Convex (serverless backend)
- **Authentication**: Clerk
- **Styling**: React Native components with custom styling

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio or Xcode (for emulators)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/Social-Media-Mobile-App.git
   cd Social-Media-Mobile-App
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npx expo start
   ```

### Run on Your Device

Scan the QR code below with your Expo Go app or your camera app:

![QR Code](https://qr.expo.dev/expo-go?owner=u.expo.dev&slug=aa937293-d403-4c39-b026-fd50f8f604b5&releaseChannel=default&host=u.expo.dev&scheme=exp+https%3A%2F%2Fu.expo.dev%2Faa937293-d403-4c39-b026-fd50f8f604b5%2Fgroup%2Ff8365701-ac1a-4c6a-a3da-10cf90cba85b)

Or use this URL:
```
exp+://expo-development-client/?url=https://u.expo.dev/aa937293-d403-4c39-b026-fd50f8f604b5/group/f8365701-ac1a-4c6a-a3da-10cf90cba85b
```

### Project Structure

- `app/`: Main application code with file-based routing
  - `(auth)/`: Authentication screens
  - `(tabs)/`: Main tab navigation screens
  - `user/`: User profile screens
- `components/`: Reusable React components
- `constants/`: App constants and theme
- `convex/`: Backend API functions and schema
- `providers/`: Context providers
- `styles/`: Styling files for different screens

## Development

### Run on Android
```bash
npx expo run:android
```

### Run on iOS
```bash
npx expo run:ios
```

### Run with Tunnel (for network issues)
```bash
npm run tunnel
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.