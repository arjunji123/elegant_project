import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Pressable
} from "react-native";
import { SettingsScreenProps } from "../../types/types";
import Arrowleft from '../../assets/icons/Arrowleft.png';

const SettingsScreen : React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [generalNotification, setGeneralNotification] = useState(true);
  const [sound, setSound] = useState(true);
  const [vibrate, setVibrate] = useState(false);
  const [specialOffers, setSpecialOffers] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleGoBack} style={styles.backButton}>
          <Image source={Arrowleft} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>Account</Text>
      </View>

      {/* Settings Items */}
      <View style={styles.item}>
        <Text style={styles.itemText}>General Notification</Text>
        <Switch
          value={generalNotification}
          onValueChange={setGeneralNotification}
          trackColor={{ false: "#ccc", true: "#4cd964" }}
          thumbColor="#fff"
        />
      </View>

      <View style={styles.item}>
        <Text style={styles.itemText}>Sound</Text>
        <Switch
          value={sound}
          onValueChange={setSound}
          trackColor={{ false: "#ccc", true: "#4cd964" }}
          thumbColor="#fff"
        />
      </View>

      <View style={styles.item}>
        <Text style={styles.itemText}>Vibrate</Text>
        <Switch
          value={vibrate}
          onValueChange={setVibrate}
          trackColor={{ false: "#ccc", true: "#4cd964" }}
          thumbColor="#fff"
        />
      </View>

      <View style={styles.item}>
        <Text style={styles.itemText}>Special Offers</Text>
        <Switch
          value={specialOffers}
          onValueChange={setSpecialOffers}
          trackColor={{ false: "#ccc", true: "#4cd964" }}
          thumbColor="#fff"
        />
      </View>

      <View style={styles.item}>
        <Text style={styles.itemText}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: "#ccc", true: "#4cd964" }}
          thumbColor="#fff"
        />
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15
  },
  backButton: { padding: 8 },
  backIcon: {
    width: 24,
    height: 32,
  },
    title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    color: '#000000',
    fontWeight: 'normal',
    fontFamily: 'Poppins',
    marginRight: 40, // to offset the back button width for perfect center
  },
  backArrow: {
    fontSize: 22,
    color: "#000"
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000"
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1"
  },
  itemText: {
    fontSize: 16,
    color: "#000"
  }
});
