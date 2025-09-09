import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useAuth } from '../../Context/AuthContext';
const SplashScreen = ({ navigation }: any) => {

  const { token } = useAuth()
  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) {
        navigation.replace('HomePageScreen'); // 👈 Navigate to Onboarding

      } else {
        navigation.replace('Onboarding'); // 👈 Navigate to Onboarding

      }
    }, 3000); // 👈 3 seconds

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/Frame.png')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent:'center',
    // marginBottom: 60,
  },
  logo: {
    width: 240,
    height: 82,
    resizeMode: 'contain',
    marginRight: 12,
  },
});

export default SplashScreen;
