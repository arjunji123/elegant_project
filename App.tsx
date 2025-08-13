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

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <AuthProvider>
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>

        <Stack.Navigator initialRouteName="Onboarding">
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LoginSignupScreen"
            component={LoginSignupScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUpScreen"
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="ForgotScreen"
            component={ForgotPage}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="OtpScreen"
            component={OtpPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HomePageScreen"
            component={HomePage}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="AddresListScreen"
            component={AddresListScreen}
           
          />
          <Stack.Screen name="AddressForm" component={AddressForm} />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
    </AuthProvider>
  );
}
