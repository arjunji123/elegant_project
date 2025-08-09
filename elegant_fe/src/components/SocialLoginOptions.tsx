// components/SocialLoginOptions.tsx

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import GoogleIcon from '../assets/images/google.png';
import FacebookIcon from '../assets/images/facebook.png';

const SocialLoginOptions = () => {
  return (
    <>
      <View style={styles.separatorContainer}>
        <View style={styles.line} />
        <Text style={styles.separatorText}>Or</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={[styles.button, styles.socialButton]}>
          <Image source={GoogleIcon} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.socialButton]}>
          <Image source={FacebookIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default SocialLoginOptions;

const styles = StyleSheet.create({
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
    fontSize: 15,
  },
  socialContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  socialButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginHorizontal: 8,
    flexDirection: 'row',
  },
});
