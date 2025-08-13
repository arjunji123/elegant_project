import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  GestureResponderEvent,
  Alert,
} from 'react-native';
import { ForgotScreenProps } from '../../types/types';
import Arrowleft from '../../assets/icons/Arrowleft.png';
import Button from '../../components/Button';

// Email validation (basic + gmail domain optional)
const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
};

const ForgotPage: React.FC<ForgotScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState("");

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('LoginSignupScreen');
    }
  };

  const validateEmail = (value:any) => {
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value.trim() === "") {
      setError("Email is required");
    } else if (!emailRegex.test(value)) {
      setError("Please enter a valid email address");
    } else {
      setError("");
    }
  };
  const handleSubmit = () => {
    navigation.replace('OtpScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleGoBack} style={styles.backButton}>
          <Image source={Arrowleft} style={styles.backIcon} />
        </Pressable>

        <Text style={styles.title}>Forgot Password</Text>
      </View>

      <Text style={styles.labelText}>
        Enter the email associated with your account and we’ll send an email with code to reset your password
      </Text>

      <View style={styles.inputFieldContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={email}
        onChangeText={validateEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="Enter your email"
      />
      </View> 
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button
        text="Confirm"
        onPress={handleSubmit}
        bgColor="#704f38"
        textColor="#ffffff"
      />
    </View>
  );
};

export default ForgotPage;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    marginTop: 20,
    backgroundColor: '#fff',
  },
  labelText: {
    justifyContent: 'center',
    marginTop: 50,
    marginBottom: 30,
  },
  header: {
    position: 'relative',
    height: 40,
    justifyContent: 'center',
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  inputError: {
    borderColor: "red",
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
    fontWeight: 'normal',
    fontFamily: 'Poppins',
    marginRight: 40,
  },
  inputFieldContainer: {
    paddingVertical: 30,
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
