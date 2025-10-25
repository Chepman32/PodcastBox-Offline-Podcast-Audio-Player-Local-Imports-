# PodcastBox - Offline Podcast & Audio Player

A fully **offline-first** iOS and Android app built with **React Native**, featuring gesture-driven navigation, physics-based animations with **Reanimated 3**, and custom visualizations using **React Native Skia**.

## Features

### Core Functionality
- **100% Offline Operation**: All audio files stored locally, no internet required
- **Local Import**: Import audio files from device storage
- **Chapter Support**: Full chapter navigation and visualization
- **Smart Bookmarks**: Create timestamped bookmarks with notes
- **Custom Playlists**: Organize your audio collection
- **Variable Speed**: 0.5x to 2.0x playback speed
- **Smart Speed** (Pro): Dynamically adjust speed based on silence detection
- **Waveform Visualization**: Real-time audio waveform display
- **Sleep Timer**: Auto-stop playback after set duration

### UI/UX
- **Gesture-First Navigation**: Edge swipes, pan-to-expand, pull-to-reveal
- **Physics-Based Animations**: Spring animations with Reanimated 3
- **Parallax Effects**: Artwork responds to scrolling
- **Micro-interactions**: Press springs, card morphs, haptic feedback
- **Dark/Light Themes**: Automatic or manual theme switching
- **Accessibility**: VoiceOver support, Dynamic Type, large touch targets

### Technical Stack
- **React Native 0.75+** with New Architecture (Fabric/TurboModules)
- **TypeScript** for type safety
- **Reanimated 3** for 60fps animations
- **React Native Skia** for custom graphics and particles
- **SQLite** for local data storage
- **Zustand** for state management
- **React Navigation** for routing
- **React Native Track Player** for audio playback

## Project Structure

```
src/
├── components/
│   ├── base/           # Reusable base components
│   └── ui/             # 100 generated UI components
├── screens/
│   ├── LibraryScreen.tsx
│   ├── NowPlayingScreen.tsx
│   ├── BookmarksScreen.tsx
│   ├── PlaylistsScreen.tsx
│   ├── SettingsScreen.tsx
│   └── SplashScreen.tsx
├── stores/
│   ├── libraryStore.ts
│   ├── playerStore.ts
│   ├── bookmarkStore.ts
│   ├── playlistStore.ts
│   └── settingsStore.ts
├── services/
│   ├── database.ts
│   └── audioPlayer.ts
├── theme/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── index.ts
│   └── ThemeContext.tsx
├── types/
│   └── index.ts
├── navigation/
│   └── AppNavigator.tsx
└── App.tsx
```

## Installation

### Prerequisites
- Node.js 18+
- React Native development environment set up
- iOS: Xcode 14+ and CocoaPods
- Android: Android Studio and SDK 31+

### Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd PodcastBox-Offline-Podcast-Audio-Player-Local-Imports-
```

2. Install dependencies:
```bash
npm install
```

3. Install iOS pods (iOS only):
```bash
npm run pod-install
```

4. Run the app:

For iOS:
```bash
npm run ios
```

For Android:
```bash
npm run android
```

## Development

### Running in Development Mode
```bash
npm start
```

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

### Testing
```bash
npm test
```

## Database Schema

The app uses SQLite for local storage with the following main tables:

- **tracks**: Audio file metadata
- **chapters**: Chapter markers within tracks
- **bookmarks**: User-created timestamps
- **playlists**: User-created collections
- **waveforms**: Cached waveform data
- **settings**: App configuration

## State Management

The app uses Zustand for state management with the following stores:

- **libraryStore**: Track library and filtering
- **playerStore**: Playback state and controls
- **bookmarkStore**: Bookmark management
- **playlistStore**: Playlist management
- **settingsStore**: App settings and preferences

## Animation System

All animations use Reanimated 3 with the following patterns:

- **Press animations**: Spring-based scale (0.96→1.0)
- **Transitions**: Timing-based with cubic easing
- **Gestures**: Pan, pinch, long-press, double-tap
- **Physics**: Spring config (stiffness: 180-320, damping: 14-22)

## Skia Rendering

Custom graphics rendered with React Native Skia:

- Particle systems (splash screen)
- Waveform visualizations
- Custom vector icons
- Gradient fills and shadows
- Path morphing animations

## Performance

- **60fps** animations on all screens
- **Gapless playback** between tracks
- **Waveform caching** for instant loading
- **Optimized FlatLists** with proper key extraction
- **Memoized components** to prevent unnecessary re-renders

## Privacy

- **100% offline**: No network requests
- **Local storage only**: All data stays on device
- **No telemetry**: No analytics or tracking
- **No accounts**: No login required

## Pro Features (IAP)

- Smart Speed: Dynamic playback adjustment
- Chapter Editor: Create and edit chapters
- Custom Themes: Additional color schemes
- Advanced Bookmarks: Color-coded with rich notes

## Roadmap

- [ ] Cloud backup/sync (optional)
- [ ] Podcast RSS import
- [ ] Audio effects (EQ, bass boost)
- [ ] CarPlay support
- [ ] Android Auto support
- [ ] Apple Watch companion app

## License

Proprietary - All rights reserved

## Credits

Built with React Native, Reanimated, Skia, and love for offline-first apps.
