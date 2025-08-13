import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../Context/AuthContext'; // make sure this is correct import

import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import LoginSignupScreen from '../screens/Login/LoginSignup';
import LoginScreen from '../screens/Login/Login';
import SignUpScreen from '../screens/Login/Signup';
import ForgotPage from '../screens/Login/ForgotPage';
import OtpPage from '../screens/Login/OtpPage';
import HomePage from '../screens/Home/HomePage';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const isDarkMode = useColorScheme() === 'dark';
  const { isLoggedIn } = useAuth();  // <-- make sure this hook is called inside <AuthProvider>

  return (
    <>
     
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isLoggedIn ? (
            <Stack.Screen name="HomePageScreen" component={HomePage} />
          ) : (
            <>
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />

            </>
          )}
        </Stack.Navigator>
    
    </>
  );
}
