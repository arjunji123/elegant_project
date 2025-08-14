import { Image, Pressable, StyleSheet, Text, TextInput, View, Alert } from "react-native";
import Arrowleft from '../../assets/icons/Arrowleft.png';
import { ConfirmPasswordScreenProps } from "../../types/types";
import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useToast } from "../../Context/ToastContext";

const ConfirmPasword: React.FC<ConfirmPasswordScreenProps> = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSubmit = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
        showToast("All fields are required","error")
      return;
    }

    if (newPassword !== confirmPassword) {
        showToast("Passwords do not match","error")
      return;
    }

    try {
      const response = await fetch("https://elegantproject-production.up.railway.app/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          otp: 123456, // make sure OTP is stored in context
          newPassword: newPassword
        }),
      });

      const data = await response.json();
console.log(data,"datadatadatadata")
      if (response.ok && data.success) {
        showToast("Password reset successfully","success")
        navigation.replace("LoginSignupScreen");
      } else {
        showToast( data.message || "Failed to reset password","error")

      }
    } catch (error) {
        showToast("Something went wrong. Please try again.","error")
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleGoBack} style={styles.backButton}>
          <Image source={Arrowleft} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>Reset Password</Text>       
      </View>

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
        <Text style={styles.label}>New Password</Text>
        <TextInput
          placeholder="Enter your new password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          style={styles.input}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />

        <Pressable onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </Pressable>
      </View>  
    </View>
  );
};

export default ConfirmPasword;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  backButton: { padding: 8 },
  backIcon: { width: 24, height: 24, resizeMode: 'contain' },
  title: { flex: 1, textAlign: 'center', fontSize: 24, fontWeight: '600', color: '#000', marginRight: 40 },
  inputFieldContainer: { paddingVertical: 30 },
  label: { marginBottom: 6, fontSize: 16, marginLeft: 5, fontWeight: '500', color: '#000' },
  input: { borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 25, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 12, fontSize: 15 },
  button: { marginTop: 20, backgroundColor: '#704f38', padding: 15, borderRadius: 25 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '500' },
});
