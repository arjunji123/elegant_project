import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,

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
      <View style={styles.overlay}>
        <Text style={styles.title}>Own the trendiest items</Text>
        <Text style={styles.subtitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
        </Text>
        <Button text="Login"
          bgColor="#ffffff"
          textColor="#704f38"
          onPress={handleGetStarted} />

      </View>
    </ImageBackground>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)', // optional: dim background image

    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24, // Improve readability
    fontFamily: 'System',
  },

});
