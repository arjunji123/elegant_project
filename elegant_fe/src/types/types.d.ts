import { GestureResponderEvent } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export interface ButtonProps {
  text: string;
  onPress: (event: GestureResponderEvent) => void;
  bgColor: string;
  textColor: string;
  border?: string; // Optional
}

export type RootStackParamList = {
  Onboarding: undefined;
  LoginSignupScreen: undefined;
  LoginScreen: undefined;
  SignUpScreen: undefined;
  ForgotScreen: undefined;
  OtpScreen: undefined;
  HomePageScreen: undefined;
  ProfileScreen: undefined;
  AccountScreen:undefined;

};
export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;

// You can also export specific screen prop aliases if needed
export type OnboardingScreenProps = ScreenProps<'Onboarding'>;
export type LoginSignupScreenProps = ScreenProps<'LoginSignupScreen'>;
export type LoginScreenProps = ScreenProps<'LoginScreen'>;
export type SignUpScreenProps = ScreenProps<'SignUpScreen'>;
export type ForgotScreenProps = ScreenProps<'ForgotScreen'>;
export type OtpScreenProps = ScreenProps<'OtpScreen'>;
export type HomePageProps = ScreenProps<'HomePageScreen'>;
export type ProfileScreenProps = ScreenProps<'ProfileScreen'>;
export type AccountScreenProps = ScreenProps<'AccountScreen'>;

