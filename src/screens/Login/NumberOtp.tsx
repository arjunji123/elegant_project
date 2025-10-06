import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";
import Button from "../../components/Button";
import { useAuth } from "../../Context/AuthContext";
import { useToast } from "../../Context/ToastContext";
import Header from "../../components/Header";

const Numberotp = ({ route, navigation }) => {
  const { phone } = route.params; 
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef<(TextInput | null)[]>([]);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60); // 1 min

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();

  // ⏱ Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    if (/^\d?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (text && index < 5) {
        inputs.current[index + 1]?.focus();
      }
      if (!text && index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const updatedOtp = otp.join('');

  // ✅ Verify OTP API
  const handleVerifyOtp = async () => {
    if (!updatedOtp) {
      showToast("Please enter OTP", "warning");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        "https://elegant-project.onrender.com/api/verify-mobile-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, otp: updatedOtp }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        showToast("Login Successful", "success");
        login(data.user, data.token);
        navigation.replace("HomePageScreen");
      } else {
        showToast(data.message || "Invalid OTP", "error");
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      showToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Resend OTP – only if timer is 0
  const handleResendOtp = async () => {
    if (timer > 0) return; // prevent clicking before 1 min
    try {
      setResending(true);
      const res = await fetch("https://elegant-project.onrender.com/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (res.ok) {
        showToast("A new OTP has been sent to your phone.", "success");
        setTimer(60); // restart 1 min countdown
      } else {
        showToast("Failed to resend OTP.", "error");
      }
    } catch (error) {
      showToast("Something went wrong, please try again.", "error");
    } finally {
      setResending(false);
    }
  };

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('SignUpScreen');
    }
  };

  return (
    <View style={styles.container}>
      <Header text={"Verify OTP"} onPress={handleGoBack} />

      <Text style={styles.labelText}>
        Enter the OTP sent to your phone to verify your account.
      </Text>

      {/* OTP Box */}
      <View style={styles.otpBox}>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
            />
          ))}
        </View>
        <Text style={styles.codeInfo}>A code has been sent to your phone</Text>

        {timer > 0 ? (
          <Text style={styles.resendText}>
            Resend in <Text style={styles.timerText}>00:{timer < 10 ? `0${timer}` : timer}</Text>
          </Text>
        ) : (
          <Text style={[styles.resendText, { color: "#007DFC" }]} onPress={handleResendOtp}>
            Resend OTP
          </Text>
        )}
      </View>

      <Button
        text="Confirm"
        onPress={handleVerifyOtp}
        bgColor="#704f38"
        textColor="#ffffff"
      />
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  labelText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  otpBox: {
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  otpInput: {
    borderBottomWidth: 1,
    borderColor: "#838383",
    width: 50,
    textAlign: 'center',
    fontSize: 25,
  },
  codeInfo: {
    fontSize: 14,
    color: '#777',
    marginTop: 10,
    marginBottom: 4,
  },
  resendText: {
    fontSize: 16,
    marginTop: 10,
  },
  timerText: {
    color: '#007DFC',
    fontWeight: '500',
  },
});

export default Numberotp;
