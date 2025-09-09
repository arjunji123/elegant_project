import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import editIcon from "../../assets/icons/editIcon.png";
import { useAuth } from "../../Context/AuthContext";
import { AccountScreenProps } from "../../types/types";
import Header from '../../components/Header';
import { useEffect, useState } from 'react';

const AccountScreen: React.FC<AccountScreenProps> = ({ navigation }) => {
  const { user, logout, token } = useAuth();
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const menuItems = [
    { icon: 'person-outline', label: 'My Profile', screen: 'ProfileScreen' },
    { icon: 'location-outline', label: 'My Addresses', screen: 'AddresListScreen' },
    { icon: 'cube-outline', label: 'My Orders', screen: 'OrdersScreen' },
    { icon: 'card-outline', label: 'Payment Method', screen: 'PaymentScreen' },
    { icon: 'shield-checkmark-outline', label: 'Privacy Policy', screen: 'PrivacyPolicyScreen' },
    { icon: 'person-add-outline', label: 'Invite Friend', screen: 'InviteFriendScreen' },
    { icon: 'call-outline', label: 'Contact Us', screen: 'ContactScreen' },
    { icon: 'settings-outline', label: 'Setting', screen: 'SettingsScreen' },
  ];

  useEffect(() => {
    const testAuth = async () => {
      try {

        const res = await fetch(`https://elegant-project.onrender.com/api/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const text = await res.text();
        const data = JSON.parse(text);
        if (data.success && data.data) {
          setProfilePic(data.data.profile_pic || "")
          setName(data.data.name)
          setEmail(data.data.email)
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    testAuth()
  })
  const handleGoBack = () => {
    navigation.navigate("HomePageScreen")
  };

  const editHandle = () => {
    navigation.navigate('ProfileScreen');
  };
  const logoutHandle = async () => {
    try {
      await logout(); // call the logout function from AuthContext
      // Navigate to login or welcome screen after logout
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }], // replace with your login screen name
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  console.log(profilePic, "profilePic")
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Header text={"Account"} onPress={handleGoBack} />

      {/* Profile Header */}
      <View style={styles.profileHeader}>
        {/* <image/> */}
        {profilePic ?
          <Image source={{ uri: profilePic }} style={styles.prfile} /> :
          <Icon name="person-circle-outline" size={60} color="#555" style={styles.avatar} />}
        <View style={styles.userInfo}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.userEmail} numberOfLines={1}
            ellipsizeMode="tail">{email}</Text>
        </View>

        <TouchableOpacity onPress={editHandle} style={styles.editButton}>
          <Image source={editIcon} style={styles.editIcon} />
        </TouchableOpacity>
      </View>

      {/* Menu List */}
      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.menuItem}
          onPress={() => navigation.navigate(`${item.screen}`)}
        >
          <Icon name={item.icon} size={22} color="#555" style={styles.menuIcon} />
          <Text style={styles.menuText}>{item.label}</Text>
        </TouchableOpacity>
      ))}

      {/* Logout */}
      <TouchableOpacity style={styles.logout} onPress={logoutHandle}>
        <Icon name="log-out-outline" size={22} color="red" style={styles.menuIcon} />
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { marginRight: 15 },
  name: { fontSize: 18, fontWeight: 'bold' },
  email: { color: '#888' },
  userEmail: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    maxWidth: 220, // ✅ prevents it from going full width
  },
  editIcon: { marginLeft: 100 },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  editButton: {
    marginRight: 10,
    padding: 5,
  },

  avatar: {
    marginRight: 15,
  },
  prfile: {
    marginRight: 15,
    height: 50,
    width: 50,
    borderRadius: 32
  }
  ,
  userInfo: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  menuIcon: { marginRight: 15 },
  menuText: { fontSize: 16 },
  logout: { marginTop: 20, flexDirection: 'row', alignItems: 'center' },
  logoutText: { color: 'red', fontSize: 16 },
  backButton: { padding: 8 },
  backIcon: { width: 24, height: 32 },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    color: '#000000',
    fontWeight: 'normal',
    fontFamily: 'Poppins',

  },
});
