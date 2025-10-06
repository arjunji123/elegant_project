import { Image, Pressable, StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { ConfirmPasswordScreenProps } from "../../types/types";
import { useState } from "react";
import Header from "../../components/Header";
import { useToast } from "../../Context/ToastContext";

const isValidPhone = (phone: string): boolean => {
  const re = /^[0-9]{10}$/;
  return re.test(phone.trim());
};

const ConfirmPassword: React.FC<ConfirmPasswordScreenProps> = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);
  const [rightIcon, setRightIcon] = useState('eye'); 
  const [rightConIcon, setRightConIcon] = useState('eye'); // Initial icon
  const { showToast } = useToast();

  const handleGoBack = () => {
    navigation.goBack();
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

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setRightIcon(showPassword ? 'eye' : 'eye-off');
  };

  const handleConPasswordVisibility = () => {
    setShowConPassword(!showConPassword);
    setRightConIcon(showConPassword ? 'eye' : 'eye-off');
  };

  const handleSubmit = async () => {
    if (!phone.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      showToast("All fields are required","error");
      return;
    }

    if (!isValidPhone(phone)) {
      showToast("Please enter a valid 10-digit phone number","error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match","error");
      return;
    }

    try {
      const response = await fetch("https://elegant-project.onrender.com/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone,
          otp: 123456, // Make sure OTP is stored in context or passed correctly
          newPassword: newPassword
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        showToast("Password reset successfully","success");
        navigation.replace("LoginSignupScreen");
      } else {
        showToast(data.message || "Failed to reset password","error");
      }
    } catch (error) {
      showToast("Something went wrong. Please try again.","error");
    }
  };

  return (
    <View style={styles.container}>
      <Header text={"Reset Password"} onPress={handleGoBack}/>

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
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Text style={styles.label}>New Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Enter your password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
          />
          <TouchableOpacity onPress={handlePasswordVisibility}>
            <Icon name={rightIcon} size={20} color="gray" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Enter your password again"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConPassword}
            style={styles.passwordInput}
          />
          <TouchableOpacity onPress={handleConPasswordVisibility}>
            <Icon name={rightConIcon} size={20} color="gray" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>  
    </View>
  );
};

export default ConfirmPassword;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  inputFieldContainer: { paddingVertical: 30 },
  label: { marginBottom: 6, fontSize: 16, marginLeft: 5, fontWeight: '500', color: '#000' },
  input: { borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 25, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 12, fontSize: 15 },
  button: { marginTop: 20, backgroundColor: '#704f38', padding: 15, borderRadius: 25 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '500' },
  inputError: { borderColor: "red" },
  inputWrapper: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#e5e5e5", borderRadius: 25, paddingHorizontal: 12, marginBottom: 12 },
  passwordInput: { flex: 1, paddingVertical: 12, fontSize: 15 },
  errorText: { color: "red", fontSize: 14, marginBottom: 10 },
});
