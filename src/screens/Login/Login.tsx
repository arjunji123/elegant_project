import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../Context/AuthContext';
import Button from '../../components/Button';
import SocialLoginOptions from '../../components/SocialLoginOptions';
import { LoginScreenProps } from '../../types/types';
import { useToast } from "../../Context/ToastContext";
import * as Keychain from 'react-native-keychain';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';



const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rightIcon, setRightIcon] = useState('eye'); // Initial icon

  const { login } = useAuth();
  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('LoginSignupScreen');
    }
  };

  useEffect(() => {
    const loadCredentials = async () => {
      const creds = await Keychain.getGenericPassword();


      if (creds) {
        setEmail(creds.username);
        setPassword(creds.password);
        setRememberMe(true);
      }
    };
    loadCredentials();
  }, []);


const handleLogin = async () => {
  if (!email && !phone) {
    showToast("Please enter email or mobile", "warning");
    return;
  }
  if (email && !password) {
    showToast("Please enter password for email login", "warning");
    return;
  }
     setLoading(true);
  try {
    const response = await fetch("https://elegant-project.onrender.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        email
          ? { email, password } // email login
          : { phone } // mobile login
      ),
    });

    const data = await response.json();
    console.log("Login response:", data);

    if (response.ok && data.success) {
      if (data.mode === "email_login") {
        // ✅ Direct login
        if (rememberMe) {
          await Keychain.setGenericPassword(email, password);
        } else {
          await Keychain.resetGenericPassword();
        }
        showToast("Login Successful", "success");
        login(data.user, data.token);
        navigation.replace("HomePageScreen");
      } else if (data.mode === "mobile_otp") {
        // ✅ OTP Flow
        showToast(data.message, "success");
        navigation.navigate("NumberotpScreen", { phone: data.phone });
      }
    } else {
      showToast(data.message || "Login Failed", "error");
    }
  } catch (error) {
    console.error("Login error:", error);
    showToast("Login Failed", "error");
  } finally {
    setLoading(false);
  }
};

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setRightIcon(showPassword ? 'eye' : 'eye-off'); // Toggle icon based on new state
  };
  const clearEmailPassword = () => {
  setEmail("");
  setPassword("");
};
  return (

    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        {/* Header */}
         <Header text={"Log In"} onPress={handleGoBack}/>

        {/* Mobile Number Input */}
        <View style={styles.inputFieldContainer}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            placeholder="Enter your mobile number"
            keyboardType="phone-pad"
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            onFocus={clearEmailPassword}

          />
        </View>

        {/* Separator */}
        <View style={styles.separatorContainer}>
          <View style={styles.line} />
          <Text style={styles.separatorText}>Or</Text>
          <View style={styles.line} />
        </View>

        {/* Email Input */}
        <View style={styles.inputFieldContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Enter your email"
            keyboardType="email-address"
            style={styles.input}
            value={email}
            onChangeText={setEmail}

            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
       <View style={styles.passwordContainer}>
  <Text style={styles.label}>Password</Text>

  <View style={styles.inputWrapper}>
    <TextInput
      placeholder="Enter your password"
      secureTextEntry={!showPassword}
      style={styles.passwordInput}
      value={password}
      onChangeText={setPassword}
    />
    <TouchableOpacity onPress={handlePasswordVisibility}>
       <Icon name={rightIcon} size={20} color="gray" />
    </TouchableOpacity>
  </View>
</View>

        <View style={styles.containerfor}>
          <TouchableOpacity
            style={styles.rememberMeContainer}
            onPress={() => setRememberMe(!rememberMe)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && <View style={styles.checkboxTick} />}
            </View>
            <Text style={styles.rememberMeText}>Remember me</Text>
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity onPress={() => navigation.navigate('ForgotScreen')}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#704f38" />
        ) : (<View style={styles.containerButton}>
          <Button text="Log In"
            bgColor="#704f38"
            textColor="#ffffff"
            onPress={handleLogin} border={undefined} />
        </View>)}

        <SocialLoginOptions />

      </View>
    </KeyboardAwareScrollView>

  );
};

export default LoginScreen;

const BOX_SIZE = 15;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: 40
  },
  header: {
    position: 'relative',
    height: 40,
    justifyContent: 'center',
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 32,

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
    // fontFamily: 'Poppins',
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

passwordInput: {
  flex: 1, // take up remaining space
  paddingVertical: 12,
  fontSize: 15,
},

eyeIcon: {
  fontSize: 18,
  marginLeft: 10,
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
    alignItems: 'center',  // this centers tick mark
    backgroundColor: 'white',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
  },
  checkboxTick: {
    width: 8, // slightly smaller for better centering
    height: 4,
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
