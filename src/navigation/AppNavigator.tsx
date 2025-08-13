// src/navigation/AppNavigator.js
import React from 'react';
import { useColorScheme, StatusBar, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../types/types';

import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import LoginSignupScreen from '../screens/Login/LoginSignup';
import LoginScreen from '../screens/Login/Login';
import SignUpScreen from '../screens/Login/Signup';
import ForgotPage from '../screens/Login/ForgotPage';
import OtpPage from '../screens/Login/OtpPage';
import HomePage from '../screens/Home/HomePage';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import AddresListScreen from '../screens/address/AddresListScreen';
import AddressForm from '../screens/address/AddressForm';
import { useAuth } from '../Context/AuthContext';
import ConfirmPasword from '../screens/Login/ConfirmPasword';
import ForgotPasswordOtp from '../screens/Login/ForgotPasswordOtp';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const isDarkMode = useColorScheme() === 'dark';
  const { isLoggedIn } = useAuth(); // Assume `loading` is true while checking auth

  

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        {isLoggedIn ? (
          // Logged in flow
          <Stack.Navigator initialRouteName="HomePageScreen">
            <Stack.Screen name="HomePageScreen" component={HomePage} options={{ headerShown: false }} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AddresListScreen" component={AddresListScreen} />
            <Stack.Screen name="AddressForm" component={AddressForm} />
          </Stack.Navigator>
        ) : (
          // Logged out flow
          <Stack.Navigator initialRouteName="Onboarding">
            <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="LoginSignupScreen" component={LoginSignupScreen} options={{ headerShown: false }} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotScreen" component={ForgotPage} options={{ headerShown: false }} />
            <Stack.Screen name="OtpScreen" component={OtpPage} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPasswordOtp" component={ForgotPasswordOtp} options={{ headerShown: false }} />

            <Stack.Screen name="ConfirmPasswordScreen" component={ConfirmPasword} options={{ headerShown: false }} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
