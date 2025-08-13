import React from 'react';
import { useColorScheme } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/Context/AuthContext'; // import your AuthProvider


import type { RootStackParamList } from './src/types/types';

import AppNavigator from './src/navigation/AppNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <AuthProvider>
      <AppNavigator/>
    
    </AuthProvider>
  );
}
