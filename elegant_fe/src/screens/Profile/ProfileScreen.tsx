import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
  ScrollView
} from "react-native";
import Button from "../../components/Button";
import avtar from "../../assets/images/avatar.png";
import Arrowleft from "../../assets/icons/Arrowleft.png";
import { ProfileScreenProps } from "../../types/types";
import { useAuth } from "../../Context/AuthContext";
import { launchImageLibrary } from "react-native-image-picker";

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user,token } = useAuth();
  const [profilePic, setProfilePic] = useState(null);
  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        maxWidth: 512,
        maxHeight: 512,
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorMessage) {
          console.log("ImagePicker Error: ", response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const pickedUri = response.assets[0].uri;
          setProfilePic(pickedUri);
        }
      }
    );
  };

  // Assuming you're passing user id from navigation params
const userId = user?.id || "123"; // fallback id for testing
  const handleGoBack = () => {
    navigation.goBack();
  };
  const tokens = {token}

  // Fetch user details on mount
  useEffect(() => {
    console.log("Testing token:", tokens.token);
    let mounted = true; // ✅ prevents state updates if unmounted

    const testAuth = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/user/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokens.token}`,
          },
        });
  
        const text = await res.text();
  
        const data = JSON.parse(text);
        if (data.success && data.data) {
        
          // ✅ Use API result directly to set form fields
          setEmail(data.data.email || "");
          setMobile(data.data.phone || "");
          setName(data.data.name || "");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
  
    if (tokens?.token && userId) {
      testAuth();
    }
    return () => { mounted = false; };
  }, []);
  
  

  // Update API call
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
         Authorization: `Bearer ${tokens.token}`,
          },
        body: JSON.stringify({ name, email, phone:mobile }),
      });

      if (!res.ok) throw new Error("Failed to update user data");
      const updatedData = await res.json();
      console.log(updatedData,"updatedDataupdatedData")
      Alert.alert("Profile updated successfully!");
      setLoading(false)
    } catch (err) {
      console.error("Error updating user data:", err);
      Alert.alert("Failed to update profile");
    } 
    
  };

  return (
    <ScrollView>
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
      <Image
        source={profilePic ? { uri: profilePic } : require("../../assets/images/avatar.png")}
        style={styles.profileImage}
      />
        {/* <Image source={avtar} style={styles.profileImage} /> */}
        <TouchableOpacity onPress={pickImage}>
          <Text style={styles.updateText}>Update Picture</Text>
        </TouchableOpacity>

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
   
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  backButton: { padding: 8 },
  backIcon: { width: 24, height: 24, resizeMode: "contain" },
  profilcontainer: { padding: 5, alignItems: "center" },
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
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
  updateText: {
    color: "#7B61FF",
    textDecorationLine: "underline",
    marginVertical: 10,
  },
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
