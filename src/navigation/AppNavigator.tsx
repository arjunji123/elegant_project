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
import SettingsScreen from '../screens/setting/SettingsScreen';
import SearchProductScreen from '../screens/Home/SearchProductScreen';
import AdvanceFilter from '../screens/Home/AdvanceFIlter';
import CardScreen from '../screens/product/CardScreen';
import CategoryScreen from '../screens/categories/CategoryScreen';
import SubCategories from '../screens/categories/SubCategories';
import ProductScreen from '../screens/product/ProductScreen';
import FilteredProducts from '../screens/product/FilteredProducts';
import ProductDetail from '../screens/product/ProductDetail';
import SearchResultScren from '../screens/product/SearchResultScren';
import DiscountProductScreen from '../screens/product/DiscountProductScreen';
import AccountScreen from '../screens/Profile/AccountScreen';
import SplashScreen from '../screens/Onboarding/SplashScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isLoggedIn } = useAuth(); // Assume `loading` is true while checking auth
  return (
    <SafeAreaProvider>
      <StatusBar />
      <NavigationContainer>
        {isLoggedIn ? (
          // Logged in flow
          <Stack.Navigator initialRouteName="HomePageScreen">
            <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false, animation: 'slide_from_right', }} />
            <Stack.Screen name="HomePageScreen" component={HomePage} options={{ headerShown: false, animation: 'slide_from_right', }} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AddresListScreen" component={AddresListScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AddressForm" component={AddressForm} options={{ headerShown: false }} />
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AdvanceFilterScreen" component={AdvanceFilter} options={{ headerShown: false }} />
            <Stack.Screen name="CardScreen" component={CardScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SearchProductScreen" component={SearchProductScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CategoryScreen" component={CategoryScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SubCategoriesScreen" component={SubCategories} options={{ headerShown: false }} />
            <Stack.Screen name="ProductScreen" component={ProductScreen} options={{ headerShown: false }} />
            <Stack.Screen name="FilteredProductsScreen" component={FilteredProducts} options={{ headerShown: false }} />
            <Stack.Screen name="ProductDetailScreen" component={ProductDetail} options={{ headerShown: false }} />
            <Stack.Screen name="DiscountProductScreen" component={DiscountProductScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SearchResultScren" component={SearchResultScren} options={{ headerShown: false }} />
            <Stack.Screen name="AccountScreen" component={AccountScreen} options={{ headerShown: false }} />
            <Stack.Screen name="HomeScreen" component={HomePage} options={{ headerShown: false }} />

          </Stack.Navigator>
        ) : (
          // Logged out flow
          <Stack.Navigator initialRouteName="Onboarding">
            <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false, animation: 'slide_from_right', }} />
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