import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView
} from "react-native";
import Button from "../../components/Button";
import avtar from "../../assets/images/profileImg.png";
import Arrowleft from "../../assets/icons/Arrowleft.png";
import { ProfileScreenProps } from "../../types/types";
import { useAuth } from "../../Context/AuthContext";
import { useToast } from "../../Context/ToastContext";
import AnimatedLoader from "../../components/AnimatedLoader";

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();
  const [profilePic, setProfilePic] = useState(null);
  const { showToast } = useToast();

  const userId = user?.id || "123"; // fallback id for testing
  const handleGoBack = () => {
    navigation.goBack();
  };
  const tokens = { token };

useEffect(() => {
  let mounted = true;
  const testAuth = async () => {
    try {
      setLoading(true);  // show loader when fetch starts

      const res = await fetch(`https://elegant-project.onrender.com/api/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.token}`,
        },
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (data.success && data.data && mounted) {
        setEmail(data.data.email || "");
        setMobile(data.data.phone || "");
        setName(data.data.name || "");
        setProfilePic(data.data.profil_pic);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      if (mounted) setLoading(false);  // hide loader after fetch finishes
    }
  };

  if (tokens?.token && userId) {
    testAuth();
  }
  return () => {
    mounted = false;
  };
}, []);


  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://elegant-project.onrender.com/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.token}`,
        },
        body: JSON.stringify({ name, email, phone: mobile, profile_pic: profilePic }),
      });

      if (!res.ok) throw new Error("Failed to update user data");
      const updatedData = await res.json();

      showToast("Profile updated successfully!", "success");
      setLoading(false);
    } catch (err) {
      showToast("Failed to update profile", "error");
      setLoading(false);
    }
  };

  return (
    <View style={styles.rootContainer}>
      <AnimatedLoader visible={loading} size={50} color="#704F38" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={handleGoBack} style={styles.backButton}>
              <Image source={Arrowleft} style={styles.backIcon} />
            </Pressable>

            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>My Profile</Text>
            </View>

            <View style={styles.placeholder} />
          </View>

          {/* Profile Section */}
          <View style={styles.profilcontainer}>
            <Image source={avtar} style={styles.profileImage} />

            {/* Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                placeholder="Enter your Name"
                style={styles.input}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="Enter your Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>

            {/* Mobile */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                placeholder="Enter your Mobile"
                style={styles.input}
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Update Button */}
          <View style={styles.containerButton}>
            <Button
              text={loading ? "Please wait..." : "Update"}
              onPress={handleUpdate}
              bgColor={"#704F38"}
              textColor={"#FFFFFF"}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#fff', // Full page background color here
  },
  scrollContent: {
    flexGrow: 1,
  },
  backButton: { padding: 2 },
  backIcon: { width: 29, height: 29, resizeMode: "contain" },

  profilcontainer: { alignItems: "center" },

  container: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12, // optional: card effect on background
    margin: 10,       // optional: spacing from edges
    flexGrow: 1,
  },
  header: { flexDirection: "row", alignItems: "center" },
  titleContainer: { flex: 1, alignItems: "center" },
  placeholder: { width: 32 },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "Poppins",
  },
  profileImage: { width: 100, height: 100, borderRadius: 20 },

  inputContainer: { width: "100%", marginBottom: 15 },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
    color: "#1B1B1B",
    fontFamily: "Poppins",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    backgroundColor: "#fff",
  },
  containerButton: { marginTop: 90 },
});
