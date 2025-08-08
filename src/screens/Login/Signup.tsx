import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Arrowleft from '../../assets/icons/Arrowleft.png';
import Button from '../../components/Button';
import SocialLoginOptions from '../../components/SocialLoginOptions';
import { SignUpScreenProps } from '../../types/types';

const SignUpScreen : React.FC<SignUpScreenProps> = ({ navigation }) => {

  const [rememberMe, setRememberMe] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLogin=() =>{
    navigation.replace('LoginScreen');
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleGoBack} style={styles.backButton}>
          <Image source={Arrowleft} style={styles.backIcon} />
        </Pressable>

        <Text style={styles.title}>Sign Up</Text>
      </View>

      {/* Mobile Number Input */}
      <View style={styles.inputFieldContainer}>
        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          placeholder="Enter your mobile number"
          keyboardType="phone-pad"
          style={styles.input}
        />
      </View>


      {/* Email Input */}
      <View style={styles.inputFieldContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          keyboardType="email-address"
          style={styles.input}
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputFieldContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          secureTextEntry={true}
          style={styles.input}
        />
      </View>
       <View style={styles.inputFieldContainer}>
        <Text style={styles.label}>Confirm password</Text>
        <TextInput
          placeholder="Text your password"
          secureTextEntry={true}
          style={styles.input}
        />
      </View>
       <View style={styles.inputFieldContainer}>
        <Text style={styles.label}>Invite Code (optional)</Text>
        <TextInput
          placeholder="Text your invite code"
          secureTextEntry={true}
          style={styles.input}
        />
      </View>
 <View style={styles.containerButton}>
      <Button text="Log In"
      bgColor="#704f38"
      textColor="#ffffff"
      onPress={handleLogin} border={undefined} />
     </View>
      <SocialLoginOptions />
      <View  style={styles.containerAllready}>
         <Text style={styles.text}>
        Already have an account?{' '}
        <Text onPress={handleLogin} style={styles.loginLink}>
          Login
        </Text>
      </Text>
      </View>
    </View>
  );
};

export default SignUpScreen;

const BOX_SIZE = 15;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    marginTop: 20,
    backgroundColor: '#fff',
  },
  containerfor: {
    flexDirection: 'row',
    justifyContent: 'space-between',  // space between left and right
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  containerButton: {
    marginTop:10
  },
  containerAllready: {
    flex: 0.5, // Takes up the full available space
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center',
  },
   text: {
    fontSize: 14,
    color: '#838383',
     // A dark grey for the main text
  },
  loginLink: {
    fontSize: 14,
    color: '#007DFC', // This makes the text blue
    fontWeight: 'regular', // Optional: Makes the link stand out more
  },
  header: {
    position: 'relative',
    height: 40,
    justifyContent: 'center',
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    color: '#000000',
    fontWeight: 'normal', // 'regular' is invalid
    fontFamily: 'Poppins',
    marginRight: 40, // to offset the back button width for perfect center
  },
  inputFieldContainer: {
    paddingVertical: 2,
  },
  label: {
    marginBottom: 6,
    fontSize: 16,
    marginLeft: 5,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'Poppins',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 15,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
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
  rememberForgotContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
 rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderWidth: 1,
    borderColor: '#4CAF50',  // green border
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',  // filled green background
  },
  checkboxTick: {
    width: 10,
    height: 6,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'white',
    transform: [{ rotate: '-45deg' }],
  },
  rememberMeText: {
    fontSize: 14,
    color: '#000',
  },
  forgotText: {
    fontSize: 13,
    color: '#999999',
  },
});
