import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import { ForgotScreenProps } from '../../types/types';
import Button from '../../components/Button';
import { useAuth } from '../../Context/AuthContext';
import { useToast } from '../../Context/ToastContext';
import Header from '../../components/Header';

// Phone number validation (10 digits)
const isValidPhone = (phone: string): boolean => {
  const re = /^[0-9]{10}$/;
  return re.test(phone.trim());
};

const ForgotPage: React.FC<ForgotScreenProps> = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const { setForgotPasswordMail } = useAuth();
  const { showToast } = useToast();

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('LoginSignupScreen');
    }
  };

  const validatePhone = (value: string) => {
    setPhone(value);
    if (value.trim() === '') {
      setError('Phone number is required');
    } else if (!isValidPhone(value)) {
      setError('Please enter a valid 10-digit phone number');
    } else {
      setError('');
    }
  };

  const handleSubmit = async () => {
    // Validate phone first
    if (!phone.trim()) {
      setError('Phone number is required');
      return;
    }
    if (!isValidPhone(phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      const response = await fetch("https://elegant-project.onrender.com/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phone.trim() }), // send phone instead of email
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setForgotPasswordMail(phone); // still storing in context, can rename if needed
        navigation.replace("ForgotPasswordOtp", { phone: data.phone }); 
      } else {
        showToast(data.message || "Failed to send reset code", "error");
      }
    } catch (err) {
      showToast(`Forgot password API error: ${err}`, "error");
    }
  };

  return (
    <View style={styles.container}>
      <Header text={"Forgot Password"} onPress={handleGoBack} />

      <Text style={styles.labelText}>
        Enter the phone number associated with your account and we’ll send a code to reset your password
      </Text>

      <View style={styles.inputFieldContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          value={phone}
          onChangeText={validatePhone}
          keyboardType="number-pad"
          maxLength={10}
          placeholder="Enter your phone number"
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
    backgroundColor: '#fff',
  },
  labelText: {
    justifyContent: 'center',
    marginTop: 50,
    marginBottom: 30,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  inputError: {
    borderColor: "red",
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
