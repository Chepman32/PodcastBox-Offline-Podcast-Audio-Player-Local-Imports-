import React, {useEffect, useState} from 'react';
import {StatusBar, LogBox} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider, useTheme} from './theme/ThemeContext';
import {AppNavigator} from './navigation/AppNavigator';
import {SplashScreen} from './screens/SplashScreen';
import {databaseService} from './services/database';
import {useAudioPlayer} from './hooks/useAudioPlayer';

// Suppress warnings for demo purposes
LogBox.ignoreAllLogs();

const AppContent: React.FC = () => {
  const {theme} = useTheme();
  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Initialize audio player and sync with store
  useAudioPlayer();

  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize database
        await databaseService.init();
        console.log('Database initialized');

        // Initialize stores (load data)
        // This would happen in individual screens

        setIsReady(true);
      } catch (error) {
        console.error('App initialization error:', error);
        setIsReady(true); // Continue anyway
      }
    };

    initialize();
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (!isReady || showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <AppNavigator />
    </>
  );
};

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
