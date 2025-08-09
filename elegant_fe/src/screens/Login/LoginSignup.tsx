import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, Alert, Image } from 'react-native';
import Button from '../../components/Button';
import SocialLoginOptions from '../../components/SocialLoginOptions';
import { LoginSignupScreenProps } from '../../types/types';
import Logo from "../../assets/images/Frame.png"





const LoginScreen: React.FC<LoginSignupScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

   const handleLogin = () => {
    navigation.replace('LoginScreen');
  };
   const handleSignUp = () => {
    navigation.replace('SignUpScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
        <Image source={Logo} style={styles.logoImage} />
      
        
      </View>
     
      <Button text="Log In"
      bgColor="#704f38"
      textColor="#ffffff"
      onPress={handleLogin} border={undefined} />
        
        <Button text="Sign Up"
      bgColor="#ffffff"
      textColor="#704f38"
      onPress={handleSignUp} border={"#704f38"} />
     
    <SocialLoginOptions />

    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 60,
  },
  logoImage: {
  width: 240,
  height: 82,
  resizeMode: 'contain',
  marginRight: 12,
},

  TextContainer:{
marginTop:30
  },
  logoText: {
    fontSize: 40,
    fontWeight: '500',
    color: '#704F38',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 40,
  },
  button: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logInButton: {
    backgroundColor: '#6B4F4F',
    marginBottom: 16,
  },
  icon: {
    width: 30,   // 🔹 increase or decrease this
    height: 30,  // 🔹 to control icon size
    resizeMode: 'contain',
  },
  signUpButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#6B4F4F',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  logInButtonText: {
    color: '#FFFFFF',
  },
  signUpButtonText: {
    color: '#6B4F4F',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 40,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  separatorText: {
    marginHorizontal: 16,
    color: '#A0A0A0',
    fontSize: 18,
  },
  socialContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  socialButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginHorizontal: 8,
    flexDirection: 'row',
  },
});
