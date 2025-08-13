import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { useAuth } from '../../Context/AuthContext';
import Arrowleft from '../../assets/icons/Arrowleft.png';
import Button from '../../components/Button';
import SocialLoginOptions from '../../components/SocialLoginOptions';
import { LoginScreenProps } from '../../types/types';



const LoginScreen : React.FC<LoginScreenProps> = ({ navigation }) => {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const { login } = useAuth();
  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Optionally handle the case where there is no screen to go back to.
      // For example, you could navigate to a home screen or do nothing.
      navigation.navigate('LoginSignupScreen');
    }
  };

  const handleLogin=async () =>{
     if ( !email || !password ) {
          Alert.alert('Error', 'Please fill all required fields');
          return;
        }
        try {
          // Send login request
          const response = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const data = await response.json();
          if (response.ok) {
            
            login(data.user, data.token);

            navigation.replace('HomePageScreen');
          } else {
            Alert.alert("Login Failed", data.message || "Invalid credentials");
          }
        } catch (error) {
          Alert.alert("Error", "Something went wrong");
        }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleGoBack} style={styles.backButton}>
          <Image source={Arrowleft} style={styles.backIcon} />
        </Pressable>

        <Text style={styles.title}>Log In</Text>
      </View>

      {/* Mobile Number Input */}
      <View style={styles.inputFieldContainer}>
        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          placeholder="Enter your mobile number"
          keyboardType="phone-pad"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}

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
      <View style={styles.inputFieldContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          secureTextEntry={true}
          style={styles.input}
          value={password}
          onChangeText={setPassword}

        />
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
     <View style={styles.containerButton}>
      <Button text="Log In"
      bgColor="#704f38"
      textColor="#ffffff"
      onPress={handleLogin} border={undefined} />
     </View>
      <SocialLoginOptions />
      
    </View>
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
    marginTop:40
  },
  header: {
    position: 'relative',
    height: 40,
    justifyContent: 'center',
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
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
