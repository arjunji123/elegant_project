// src/navigation/AppNavigator.js
import React from 'react';
import { useColorScheme, StatusBar, ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'; // <-- Import DefaultTheme
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../types/types';

// Import all your screens
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
import Cart from '../screens/cart/Cart';
import OrderSuccessfull from '../screens/cart/OrderSuccess';
import Checkout from '../screens/cart/Checkout';
import PrivacyPage from '../screens/setting/PrivacyPolicy';
import OrdersScreen from '../screens/Profile/OrderScreen';
import Coupon from '../screens/cart/Coupon';
import SelectAddress from '../screens/cart/SelectAddress';
import Numberotp from '../screens/Login/NumberOtp';
import ContactUsScreen from '../screens/Profile/ContactUsScreen';


const Stack = createNativeStackNavigator<RootStackParamList>();

// Define a custom theme to prevent white flashing on transitions
// **REPLACE '#FFFFFF' WITH YOUR APP'S PRIMARY BACKGROUND COLOR**
const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffffff', // <-- Set your background color here!
  },
};

export default function AppNavigator() {
  const { isLoggedIn } = useAuth(); // Assume `loading` is true while checking auth

  // Default screen options for both stacks
  const defaultScreenOptions = {
    headerShown: false,
    // Helps eliminate the white flash/flicker on goBack, especially on Android
    // presentation: 'transparentModal', 
  };
  
  // Custom animation options for specific screens (if needed)
  const slideRightOptions = {
    animation: 'slide_from_right',
  };

  return (
    // Optionally set background on SafeAreaProvider as an extra precaution
    <SafeAreaProvider style={{ backgroundColor: AppTheme.colors.background }}>
      <StatusBar />
      <NavigationContainer theme={AppTheme}> {/* <-- Apply the custom theme */}
        {isLoggedIn ? (
          // Logged in flow
          <Stack.Navigator 
            initialRouteName="HomePageScreen"
            screenOptions={defaultScreenOptions} // <-- Apply default options
          >
            <Stack.Screen name="SplashScreen" component={SplashScreen} options={slideRightOptions} />
            <Stack.Screen name="HomePageScreen" component={HomePage} options={slideRightOptions} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
            <Stack.Screen name="CouponScreen" component={Coupon} />
            <Stack.Screen name="PrivacyPageScreen" component={PrivacyPage} />
            <Stack.Screen name="SelectAddressScreen" component={SelectAddress} />
            <Stack.Screen name="ContactUsScreen" component={ContactUsScreen} />

            <Stack.Screen name="OrderSuccessfull" component={OrderSuccessfull} options={slideRightOptions} />
            <Stack.Screen name="CheckoutScreen" component={Checkout} options={slideRightOptions} />

            <Stack.Screen name="CartScreen" component={Cart} />
            <Stack.Screen name="AddresListScreen" component={AddresListScreen} />
            <Stack.Screen name="AddressForm" component={AddressForm} />
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
            <Stack.Screen name="AdvanceFilterScreen" component={AdvanceFilter} />
            <Stack.Screen name="CardScreen" component={CardScreen} />
            <Stack.Screen name="SearchProductScreen" component={SearchProductScreen} />
            <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
            <Stack.Screen name="SubCategoriesScreen" component={SubCategories} />
            <Stack.Screen name="ProductScreen" component={ProductScreen} />
            <Stack.Screen name="FilteredProductsScreen" component={FilteredProducts} />
            <Stack.Screen name="ProductDetailScreen" component={ProductDetail} />
            <Stack.Screen name="DiscountProductScreen" component={DiscountProductScreen} />
            <Stack.Screen name="SearchResultScren" component={SearchResultScren} />
            <Stack.Screen name="AccountScreen" component={AccountScreen} />
            <Stack.Screen name="HomeScreen" component={HomePage} />

          </Stack.Navigator>
        ) : (
          // Logged out flow
          <Stack.Navigator 
            initialRouteName="Onboarding"
            screenOptions={defaultScreenOptions} // <-- Apply default options
          >
            <Stack.Screen name="SplashScreen" component={SplashScreen} options={slideRightOptions} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="LoginSignupScreen" component={LoginSignupScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen name="ForgotScreen" component={ForgotPage} />
            <Stack.Screen name="OtpScreen" component={OtpPage} />
            <Stack.Screen name="ForgotPasswordOtp" component={ForgotPasswordOtp} />
            <Stack.Screen name="ConfirmPasswordScreen" component={ConfirmPasword} />
            <Stack.Screen name="NumberotpScreen" component={Numberotp} />

          </Stack.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}