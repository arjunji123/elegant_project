import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Arrowleft from '../../assets/icons/Arrowleft.png';
import Button from '../../components/Button';
import SocialLoginOptions from '../../components/SocialLoginOptions';
import { SignUpScreenProps } from '../../types/types';
import { useAuth } from '../../Context/AuthContext';
import { useToast } from '../../Context/ToastContext';

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const { setSignupemail, setStorePassword } = useAuth();
  const { showToast } = useToast();

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('LoginSignupScreen');
    }
  };

  const handleLogin = () => {
    navigation.replace('LoginScreen');
  };

  const handleSignup = async () => {
    if (!name || !phone || !email || !password || !confirmPassword) {
      showToast('Please fill all required fields', 'warning');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    try {
      const response = await fetch(
        'https://elegantproject-production.up.railway.app/api/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            phone,
            password,
            inviteCode: inviteCode || undefined,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSignupemail(email);
        setStorePassword(password);
        showToast(`Signup successful OTP sent to ${email}`, 'success');
        navigation.replace('OtpScreen');
      } else {
        showToast(data.message || 'Signup failed', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Something went wrong. Please try again.', 'error');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // adjust for header height
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleGoBack}>
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
            returnKeyType="next"
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
            returnKeyType="next"
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
            returnKeyType="next"
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
            returnKeyType="next"
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
            returnKeyType="done"
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
    paddingBottom: 40, // extra space for keyboard
    backgroundColor: '#fff',
  },
  containerButton: {
    marginTop: 10,
  },
  containerAllready: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  text: {
    fontSize: 14,
    color: '#838383',
  },
  loginLink: {
    fontSize: 14,
    color: '#007DFC',
  },
  header: {
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
    fontFamily: 'Poppins',
    marginRight: 40,
  },
  backIcon: {
    width: 24,
    height: 32,
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
});
