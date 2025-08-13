import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import editIcon from "../../assets/icons/editIcon.png";
import { useAuth } from "../../Context/AuthContext";
import Arrowleft from '../../assets/icons/Arrowleft.png';
import { AccountScreenProps } from "../../types/types";

const AccountScreen: React.FC<AccountScreenProps> = ({ navigation }) => {
  const { user,logout } = useAuth();

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

  const handleGoBack = () => {
    navigation.goBack();
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
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleGoBack} style={styles.backButton}>
          <Image source={Arrowleft} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>Account</Text>
      </View>

      {/* Profile Header */}
      <View style={styles.header}>
        <Icon name="person-circle-outline" size={60} color="#555" style={styles.avatar} />
        <View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
        <TouchableOpacity onPress={editHandle}>
          <Image source={editIcon} style={styles.editIcon} />
        </TouchableOpacity>
      </View>

      {/* Menu List */}
      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.menuItem}
          onPress={() => navigation.navigate(item.screen)}
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
  editIcon: { marginLeft: 100 },
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
  backIcon: { width: 24, height: 24, resizeMode: 'contain' },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    color: '#000000',
    fontWeight: 'normal',
    fontFamily: 'Poppins',
    marginRight: 40, // to offset the back button width for perfect center
  },
});