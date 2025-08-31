import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Button from '../../components/Button';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/types';

type OnboardingScreenProps = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const handleGetStarted = () => {
    navigation.replace('LoginSignupScreen');
  };

  return (
    <ImageBackground
      source={require('../../assets/images/onBoarding.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Own the trendiest items</Text>
          <Text style={styles.subtitle}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
          </Text>
          <Button
            text="Get Started"
            bgColor="#ffffff"
            textColor="#704f38"
            onPress={handleGetStarted}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end', // button & text bottom par
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40, // bottom space for safe area
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
});
