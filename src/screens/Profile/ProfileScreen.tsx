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

import { ProfileScreenProps } from "../../types/types";
import { useAuth } from "../../Context/AuthContext";
import { useToast } from "../../Context/ToastContext";
import * as ImagePicker from "react-native-image-picker"; // 👈 for selecting images
import Header from "../../components/Header";

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();
  const [profilePic, setProfilePic] = useState<string | null>(null);
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

        const res = await fetch(`https://elegant-project.onrender.com/api/user`, {
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
          setProfilePic(data.data.profile_pic);
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
  }, [profilePic]);


  const handlePickImage = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: "photo", quality: 0.8 },
      (response) => {
        if (response.didCancel) return;
        if (response.errorMessage) {
          showToast("Image pick failed", "error");
          return;
        }
        if (response.assets && response.assets[0].uri) {
          setProfilePic(response.assets[0].uri); // set local image uri
        }
      }
    );
  };


  const handleUpdate = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", mobile);

 if (profilePic && (profilePic.startsWith("file://") || profilePic.startsWith("content://"))) {
      const filename = profilePic.split("/").pop() || "profile.jpg";
      const fileType = filename.split(".").pop();

      formData.append("profile_pic", {
        uri: profilePic,
        name: filename,
        type: `image/${fileType}`,
      } as any);
    }



      const res = await fetch(`https://elegant-project.onrender.com/api/user`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${tokens.token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update user data");

      const updatedData = await res.json();
      showToast("Profile updated successfully!", "success");

      // update local state
      setProfilePic(updatedData.data.profile_pic);
      setLoading(false);
    } catch (err) {
      console.log(err, "Failed to update profile");
      showToast("Failed to update profile", "error");
      setLoading(false);
    }
  };
  return (
    <View style={styles.rootContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {/* Header */}
          <Header text={"My Profile"} onPress={handleGoBack} />

          {/* Profile Section */}
          <View style={styles.profilcontainer}>
            <TouchableOpacity onPress={handlePickImage}>
              <Image
                source={profilePic ? { uri: profilePic } : require("../../assets/images/profileImg.png")}
                style={styles.profileImage}
              />
              <Text style={styles.changePicText}>Update Picture</Text>
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
    paddingTop: 10,
    paddingHorizontal: 10,
    flexGrow: 1,
  },
  backButton: { padding: 2 },
  backIcon: { width: 29, height: 29, resizeMode: "contain" },

  profilcontainer: { alignItems: "center", marginTop: 50 },

  container: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12, // optional: card effect on background
    // margin: 10,       
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
  profileImage: { width: 135, height: 135, borderRadius: 30 },
  changePicText: {
    alignItems: "center",
    marginTop: 6,
    fontSize: 16,
    textDecorationLine: 'underline',
    color: "#838383",
    fontWeight: "400",
    textAlign: "center",
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