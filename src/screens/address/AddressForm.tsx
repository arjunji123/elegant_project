import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  KeyboardAvoidingView, // <-- Import KeyboardAvoidingView
  Platform // <-- Import Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from "../../Context/AuthContext";
import { useToast } from "../../Context/ToastContext";
import Header from '../../components/Header';


const AddressForm = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { token } = useAuth();
  const { showToast } = useToast();

  const { mode = 'add', addressData = {} } = route.params || {};

  const [title, setTitle] = useState("");
  const [street, setStreet] = useState("");
  const [flatNo, setFlatNo] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && addressData) {
      setTitle(addressData.title || "");
      setStreet(addressData.street || "");
      setFlatNo(addressData.flat_no || "");
      setPincode(addressData.pincode || "");
      setCity(addressData.city || "");
      setState(addressData.state || "");
      setMobileNo(addressData.mobile_no || "");
      setIsDefault(addressData.is_default === 1);
    }
  }, [mode, addressData]);

  const handleSave = async () => {
    if (!title.trim() || !flatNo.trim() || !street.trim() || !pincode.trim() || !city.trim() || !state.trim() || !mobileNo.trim()) {
      showToast("Please fill all required fields", "warning");
      return;
    }

    const payload = {
      title: title.trim(),
      street: street.trim(),
      flat_no: flatNo.trim(),
      pincode: pincode.trim(),
      city: city.trim(),
      state: state.trim(),
      mobile_no: mobileNo.trim(),
      is_default: isDefault ? 1 : 0,
    };

    console.log(token, "payloadpayload")
    try {
      const response = await fetch(
        mode === 'edit'
          ? `https://elegant-project.onrender.com/api/address/${addressData.id}`
          : `https://elegant-project.onrender.com/api/address`,
        {
          method: mode === 'edit' ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Auth token
          },
          body: JSON.stringify(payload),
        }
      );

      // const data = await response.json();

      const data = await response.json().catch(() => ({}));
      console.log("Server response:", data);

      if (!response.ok) throw new Error(data.message || `Failed with status ${response.status}`);

      console.log(`${mode === 'edit' ? 'Updated' : 'Added'} successfully addred bro call it:`, data);

      // ✅ Trigger refresh of address list when going back
      navigation.navigate("AddresListScreen", { refresh: true });
    } catch (error) {
      console.error("Error saving address:", error.message);
      showToast(mode, "error")

      showToast(error?.message, "error")
      // Alert.alert(error.message);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };
  
  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Standard behavior for keyboard avoidance
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // Adjust offset if needed (e.g., if you have a fixed header)
    >
      <ScrollView 
        contentContainerStyle={styles.container} 
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Header text={mode === 'edit' ? 'Edit Address' : 'Add Address'} onPress={handleGoBack} />


        {/* Title Input */}
        <Text style={styles.label}>TITLE</Text>
        <TextInput
          style={styles.input}
          placeholder="Home"
          value={title}
          onChangeText={setTitle}
          returnKeyType="next"
        />

        {/* Flat/Plot No Input */}
        <Text style={styles.label}>FLAT / PLOT NO.</Text>
        <TextInput 
          style={styles.input} 
          placeholder="FLAT / PLOT NO" 
          value={flatNo} 
          onChangeText={setFlatNo} 
          returnKeyType="next"
        />
        
        {/* Street Input */}
        <Text style={styles.label}>STREET</Text>
        <TextInput 
          style={styles.input} 
          placeholder="STREET" 
          value={street} 
          onChangeText={setStreet} 
          returnKeyType="next"
        />

        {/* Pincode */}
        <Text style={styles.label}>PINCODE</Text>
        <TextInput
          style={styles.input}
          placeholder="PINCODE"
          keyboardType="numeric"
          value={pincode}
          onChangeText={setPincode}
          returnKeyType="next"
        />
        
        {/* City */}
        <Text style={styles.label}>CITY</Text>
        <TextInput 
          style={styles.input} 
          placeholder="CITY" 
          value={city} 
          onChangeText={setCity} 
          returnKeyType="next"
        />

        {/* State */}
        <Text style={styles.label}>STATE</Text>
        <TextInput 
          style={styles.input} 
          placeholder="STATE" 
          value={state} 
          onChangeText={setState} 
          returnKeyType="next"
        />

        {/* Mobile */}
        <Text style={styles.label}>MOBILE NO.</Text>
        <TextInput
          style={styles.input}
          placeholder="MOBILE NO"
          keyboardType="phone-pad"
          value={mobileNo}
          onChangeText={setMobileNo}
          maxLength={10} // Added max length for phone number
          returnKeyType="done"
        />

        {/* Default Checkbox */}
        <TouchableOpacity style={styles.checkboxRow} onPress={() => setIsDefault(!isDefault)}>
          <Ionicons
            name={isDefault ? 'checkbox' : 'square-outline'}
            size={22}
            color="#000"
          />
          <Text style={{ marginLeft: 8, color: '#555' }}>Make this the default address</Text>
        </TouchableOpacity>

        {/* Save Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleSave}>
          <Text style={styles.addButtonText}>
            {mode === 'edit' ? 'Update Address' : 'Add Address'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // Removed flex: 1 from container style to let KeyboardAvoidingView handle the height
  container: { padding: 16, backgroundColor: '#fff', paddingTop: 30, paddingBottom: 50 }, 
  searchBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f3f3',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginBottom: 14,
  },
  currentAddressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  mapImage: { width: '100%', height: 150, borderRadius: 8, marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6, marginTop: 6 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 12 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  addButton: {
    backgroundColor: '#7B4B2A', paddingVertical: 14, borderRadius: 25, alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontWeight: '600' },
});

export default AddressForm;