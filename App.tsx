import React, { useEffect } from 'react';
import { Appearance  } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/Context/AuthContext'; // import your AuthProvider
import { ToastProvider } from "./src/Context/ToastContext";


import type { RootStackParamList } from './src/types/types';

import AppNavigator from './src/navigation/AppNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    Appearance.setColorScheme('light'); // Force light mode
  }, []);
  return (
    <ToastProvider>
<AuthProvider>
      <AppNavigator/>
    
    </AuthProvider>
    </ToastProvider>
    
  );
}
