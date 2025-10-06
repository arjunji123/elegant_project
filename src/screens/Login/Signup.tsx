import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Button from '../../components/Button';
import SocialLoginOptions from '../../components/SocialLoginOptions';
import { SignUpScreenProps } from '../../types/types';
import { useAuth } from '../../Context/AuthContext';
import { useToast } from '../../Context/ToastContext';
import Header from '../../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const { setSignupemail, setStorePassword } = useAuth();
  
  // State for showing password/confirm password and their icons
  const [rightIcon, setRightIcon] = useState('eye');
  const [rightConIcon, setRightConIcon] = useState('eye');
  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);

  // New state to track password field focus
  const [isPasswordFocused, setIsPasswordFocused] = useState(false); // <-- NEW STATE

  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
    noSpaces: false,
  });
  
  const validatePassword = (pwd: string) => {
    setPasswordErrors({
      length: pwd.length >= 8 && pwd.length <= 64,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
      specialChar: /[^A-Za-z0-9]/.test(pwd),
      noSpaces: !/\s/.test(pwd),
    });
  };
  
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
    console.log("hello Its signup");
    if (!name || !phone || !email || !password || !confirmPassword) {
      showToast('Please fill all required fields', 'warning');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    const isPasswordValid = Object.values(passwordErrors).every(Boolean);
    if (!isPasswordValid) {
      showToast("Password does not meet requirements", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    try {
      const response = await fetch(
        'https://elegant-project.onrender.com/api/register',
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
      console.log(data, "datadatadata");
      if (response.ok) {
        setSignupemail(email);
        setStorePassword(password);
        showToast(`Signup successful OTP sent to ${phone}`, 'success');
        navigation.replace('OtpScreen', { phone: data.phone });
      } else {
        showToast(data.message || 'Signup failed', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Something went wrong. Please try again.', 'error');
    }
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setRightIcon(showPassword ? 'eye' : 'eye-off');
  };
  
  const handleConPasswordVisibility = () => {
    setShowConPassword(!showConPassword);
    setRightConIcon(showConPassword ? 'eye' : 'eye-off');
  };
  
  // Helper component for the validation text
  const ValidationText = ({ condition, text }: { condition: boolean, text: string }) => (
    <Text style={[styles.validationText, { color: condition ? 'green' : 'red' }]}>
      {condition ? '✓' : '•'} {text}
    </Text>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Header text={"Sign up"} onPress={handleGoBack} />

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
        <View style={styles.passwordContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                validatePassword(text);
              }}
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
              returnKeyType="next"
              // Add focus/blur handlers here
              onFocus={() => setIsPasswordFocused(true)} // <-- SET FOCUS TO TRUE
              onBlur={() => setIsPasswordFocused(false)}  // <-- SET FOCUS TO FALSE
            />
            <TouchableOpacity onPress={handlePasswordVisibility}>
              <Icon name={rightIcon} size={20} color="gray" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Password Validation Requirements (Conditional Rendering) */}
        {isPasswordFocused && (
          <View style={styles.validationList}>
            <ValidationText condition={passwordErrors.length} text="8–64 characters" />
            <ValidationText condition={passwordErrors.uppercase} text="At least one uppercase letter" />
            <ValidationText condition={passwordErrors.lowercase} text="At least one lowercase letter" />
            <ValidationText condition={passwordErrors.number} text="At least one number" />
            <ValidationText condition={passwordErrors.specialChar} text="At least one special character" />
            <ValidationText condition={passwordErrors.noSpaces} text="No spaces allowed" />
          </View>
        )}

        {/* Confirm Password */}
        <View style={styles.passwordContainer}>
          <Text style={styles.label}>Confirm password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Enter your password again"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConPassword}
              style={styles.passwordInput}
              returnKeyType="done"
            />
            <TouchableOpacity onPress={handleConPasswordVisibility}>
              <Icon name={rightConIcon} size={20} color="gray" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Invite Code (Optional) - currently commented out in original */}

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
    paddingBottom: 40,
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
  // ... (Header styles omitted for brevity, as they were not changed)
  
  // Custom styles for validation text
  validationList: {
    marginBottom: 12,
    marginLeft: 5,
  },
  validationText: { // Combined errorText style
    fontSize: 13,
    marginLeft: 8,
    // Color will be set dynamically based on condition
  },
  // The old errorText view is now replaced by validationList
  // You can remove the old commented-out or unused styles if desired.
  // ... (Other styles remain unchanged)
  inputFieldContainer: {
    paddingVertical: 2,
  },
  passwordContainer: {
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 25,
    paddingHorizontal: 12,
  },
  eyeIcon: {
    fontSize: 18,
    marginLeft: 10,
  },
  passwordInput: {
    flex: 1, // take up remaining space
    paddingVertical: 12,
    fontSize: 15,
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