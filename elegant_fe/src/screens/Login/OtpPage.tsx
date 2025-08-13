import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  Alert
} from 'react-native';
import { OtpScreenProps } from '../../types/types';
import Arrowleft from '../../assets/icons/Arrowleft.png';
import Button from '../../components/Button';
import { useAuth } from '../../Context/AuthContext';

const OTPScreen: React.FC<OtpScreenProps> = ({ navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(57);
  const inputs = useRef<(TextInput | null)[]>([]);
  const { signupemail, login  } = useAuth();
  const [resending, setResending] = useState(false);


  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('SignUpScreen');
    }
  };

  const handleChange = (text: string, index: number) => {
    if (/^\d?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      console.log(newOtp,otp,"sonal123");
      if (text && index < 5) {
        inputs.current[index + 1]?.focus();
      }
      if (!text && index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };
  const updatedOtp = otp.join('');
  console.log(typeof(updatedOtp),updatedOtp,"updatedOtp",signupemail)



  const handleSubmit= async () => {
    try {
      const res = await fetch("http://192.168.1.12:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({email: signupemail,  otp: updatedOtp }),
      });
      const data = await res.json();

        if (res.ok && data.user) {
          login(data.user, data.token);
          navigation.replace("HomePageScreen"); 
        }
        else {
          Alert.alert("Invalid OTP", "Please try again.");
        }
      

    } catch (error) {
      console.error("OTP verification error:", error);
      Alert.alert("Error", "Something went wrong, please try again.");
    }
  };

  const handleResendOtp = async () => {
    try {
      setResending(true);
      const res = await fetch("http://192.168.1.12:5000/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupemail }),
      });

      if (res.ok) {
        Alert.alert("OTP Sent", "A new OTP has been sent to your email.");
        setTimer(57); // restart timer
      } else {
        Alert.alert("Error", "Failed to resend OTP.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      Alert.alert("Error", "Something went wrong, please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleGoBack} style={styles.backButton}>
          <Image source={Arrowleft} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>Verify OTP</Text>
      </View>

      {/* Description */}
      <Text style={styles.labelText}>
        Enter your OTP which has been sent to your email and completely verify your account.
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
        <Text style={styles.resendText} onPress={handleResendOtp} >
          Resend in <Text style={styles.timerText}>00:{timer < 10 ? `0${timer}` : timer}</Text>
        </Text>
      </View>

      {/* Confirm Button */}
      <Button
        text="Confirm"
        onPress={handleSubmit}
        bgColor="#704f38"
        textColor="#ffffff"
      />
    </View>
  );
};

export default OTPScreen;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    marginTop: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
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
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginRight: 32,
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
    borderColor:"#838383",
    width: 50,
    // color:"#838383",
    // height: 50,
    textAlign: 'center',
    fontSize: 25,
  },
  codeInfo: {
    fontSize: 14,
    color: '#777',
    marginTop:10,
    marginBottom: 4,
  },
  resendText: {
    fontSize: 16,
    marginTop:10,
    color: '#007DFC',
  },
  timerText: {
    color: '#007DFC',
    fontWeight: '500',
  },
});
