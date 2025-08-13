import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Arrowleft from '../../assets/icons/Arrowleft.png';
import Button from '../../components/Button';
import SocialLoginOptions from '../../components/SocialLoginOptions';
import { SignUpScreenProps } from '../../types/types';
import { useAuth } from '../../Context/AuthContext';

const SignUpScreen : React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { setSignupemail } = useAuth();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLogin=() =>{
    navigation.replace('LoginScreen');
  }
  const handleSignup = async () => {
    if (!name || !phone || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://192.168.29.231:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          inviteCode: inviteCode || undefined,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSignupemail(email);
        Alert.alert('Success', 'Signup successful', [
          { text: 'OK', onPress: () => navigation.replace('OtpScreen') },
        ]);
      } else {
        Alert.alert('Error', data.message || 'Signup failed');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  >
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleGoBack} style={styles.backButton}>
          <Image source={Arrowleft} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.headerTitle}>Sign Up</Text>
      </View>

      {/* Name Input */}
      <View style={styles.inputFieldContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      </View>

      {/* Mobile Number */}
      <View style={styles.inputFieldContainer}>
        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          placeholder="Enter your mobile number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
        />
      </View>

      {/* Email */}
      <View style={styles.inputFieldContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      {/* Password */}
      <View style={styles.inputFieldContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>

      {/* Confirm Password */}
      <View style={styles.inputFieldContainer}>
        <Text style={styles.label}>Confirm password</Text>
        <TextInput
          placeholder="Enter your password again"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>

      {/* Invite Code */}
      <View style={styles.inputFieldContainer}>
        <Text style={styles.label}>Invite Code (optional)</Text>
        <TextInput
          placeholder="Enter your invite code"
          value={inviteCode}
          onChangeText={setInviteCode}
          style={styles.input}
        />
      </View>

      <View style={styles.containerButton}>
        <Button
          text="Sign Up"
          bgColor="#704f38"
          textColor="#ffffff"
          onPress={handleSignup}
        />
      </View>

      <SocialLoginOptions />

      <View style={styles.containerAllready}>
        <Text style={styles.text}>
          Already have an account?{' '}
          <Text onPress={handleLogin} style={styles.loginLink}>
            Login
          </Text>
        </Text>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
);
};



export default SignUpScreen;

const BOX_SIZE = 15;

export const styles = StyleSheet.create({
  container: {
  
    padding: 24,
   
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
headerTitle: {
  flex: 1,
    textAlign: 'center',
    fontSize: 24,
    color: '#000000',
    fontWeight: 'normal', // 'regular' is invalid
    fontFamily: 'Poppins',
    marginRight: 40,
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
