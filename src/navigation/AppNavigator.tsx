import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';
import {useTheme} from '../theme/ThemeContext';

// Screens
import {LibraryScreen} from '../screens/LibraryScreen';
import {NowPlayingScreen} from '../screens/NowPlayingScreen';
import {BookmarksScreen} from '../screens/BookmarksScreen';
import {PlaylistsScreen} from '../screens/PlaylistsScreen';
import {SettingsScreen} from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  const {theme} = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: -2},
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          tabBarIcon: ({color}) => <Text style={{fontSize: 24}}>📚</Text>,
        }}
      />
      <Tab.Screen
        name="Now Playing"
        component={NowPlayingScreen}
        options={{
          tabBarIcon: ({color}) => <Text style={{fontSize: 24}}>▶️</Text>,
        }}
      />
      <Tab.Screen
        name="Bookmarks"
        component={BookmarksScreen}
        options={{
          tabBarIcon: ({color}) => <Text style={{fontSize: 24}}>🔖</Text>,
        }}
      />
      <Tab.Screen
        name="Playlists"
        component={PlaylistsScreen}
        options={{
          tabBarIcon: ({color}) => <Text style={{fontSize: 24}}>📝</Text>,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({color}) => <Text style={{fontSize: 24}}>⚙️</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const {theme} = useTheme();

  return (
    <NavigationContainer
      theme={{
        dark: theme.isDark,
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text,
          border: theme.colors.border,
          notification: theme.colors.primary,
        },
      }}
    >
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Main" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
