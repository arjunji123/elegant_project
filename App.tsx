import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/Context/AuthContext'; // import your AuthProvider

import OnboardingScreen from './src/screens/Onboarding/OnboardingScreen';
import LoginSignupScreen from './src/screens/Login/LoginSignup'; 
import LoginScreen from './src/screens/Login/Login'; 
import type { RootStackParamList } from './src/types/types';
import SignUpScreen from './src/screens/Login/Signup';
import ForgotPage from './src/screens/Login/ForgotPage';
import OtpPage from './src/screens/Login/OtpPage';
import HomePage from './src/screens/Home/HomePage';
import ProfileScreen from './src/screens/Profile/ProfileScreen';
import AddresListScreen from './src/screens/address/AddresListScreen';
import AddressForm from './src/screens/address/AddressForm';
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
