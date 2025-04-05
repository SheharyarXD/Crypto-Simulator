import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../../utils/AuthContext';  // Import the auth context
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import { View, TouchableOpacity, Text } from 'react-native';

// Import your screens
import HomeScreen from './screens/HomeScreen';
import TradingScreen from './screens/TradingScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import ExploreScreen from './screens/ExploreScreen';

const Drawer = createDrawerNavigator();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, logout } = useAuth(); 

  const handleLogout = () => {
    logout(); 
  };

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        drawerActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        drawerInactiveTintColor: 'gray',
        drawerStyle: {
          width: 250,
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: Colors[colorScheme ?? 'light'].text,
        },
      }}
    >
      {/* Home Screen */}
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
          title: 'Home',
        }}
      />

      {/* Trading Screen (only visible if logged in) */}
      {isAuthenticated && (
        <Drawer.Screen
          name="Trading"
          component={TradingScreen}
          options={{
            drawerIcon: ({ color }) => (
              <IconSymbol size={28} name="chart-line" color={color} />
            ),
            title: 'Trading',
          }}
        />
      )}

      {/* Profile Screen (only visible if logged in) */}
      {isAuthenticated && (
        <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            drawerIcon: ({ color }) => (
              <IconSymbol size={28} name="person.fill" color={color} />
            ),
            title: 'Profile',
          }}
        />
      )}

      {/* Login Screen (only visible if not logged in) */}
      {!isAuthenticated && (
        <Drawer.Screen
          name="Login"
          component={LoginScreen}
          options={{
            drawerIcon: ({ color }) => (
              <IconSymbol size={28} name="key.fill" color={color} />
            ),
            title: 'Login',
          }}
        />
      )}

      {/* Sign Up Screen (only visible if not logged in) */}
      {!isAuthenticated && (
        <Drawer.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{
            drawerIcon: ({ color }) => (
              <IconSymbol size={28} name="person-plus.fill" color={color} />
            ),
            title: 'Sign Up',
          }}
        />
      )}

      {/* Explore Screen */}
      <Drawer.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          drawerIcon: ({ color }) => (
            <IconSymbol size={28} name="search.fill" color={color} />
          ),
          title: 'Explore',
        }}
      />

    </Drawer.Navigator>
  );
}
