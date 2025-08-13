import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from "../../Context/AuthContext";


const AddressForm = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { token } = useAuth();

  const { mode = 'add', addressData = {} } = route.params || {};

  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && addressData) {
      setTitle(addressData.title || '');
      setAddress(addressData.address || '');
      setIsDefault(addressData.is_default === 1);
    }
  }, [mode, addressData]);

  const handleSave = async () => {
    if (!title.trim() || !address.trim()) {
        Alert.alert("Please enter both title and address");
      return;
    }

    const payload = {
      title,
      address,
      is_default: isDefault ? 1 : 0,
    };

    try {
      const response = await fetch(
        mode === 'edit'
          ? `http://192.168.1.12:5000/api/address/${addressData.id}`
          : `http://192.168.1.12:5000/api/address`,
        {
          method: mode === 'edit' ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Auth token
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Something went wrong');

      console.log(`${mode === 'edit' ? 'Updated' : 'Added'} successfully:`, data);

      // ✅ Trigger refresh of address list when going back
      navigation.navigate("AddresListScreen", { refresh: true });
    } catch (error) {
      console.error("Error saving address:", error.message);
      Alert.alert(error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Search Box */}
     

      {/* Current Address */}
      <View style={styles.currentAddressRow}>
        <Ionicons name="locate" size={20} color="black" />
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontWeight: 'bold' }}>Use Current Address</Text>
          <Text style={{ color: '#666' }}>41 B Model Town, Albert Road, Sydney, Australia</Text>
        </View>
      </View>

      {/* Static Map */}
      <Image
        source={{ uri: 'https://via.placeholder.com/300x150.png?text=Map+Preview' }}
        style={styles.mapImage}
      />

      {/* Title Input */}
      <Text style={styles.label}>TITLE</Text>
      <TextInput
        style={styles.input}
        placeholder="Home"
        value={title}
        onChangeText={setTitle}
      />

      {/* Address Input */}
      <Text style={styles.label}>ADDRESS</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter address"
        value={address}
        onChangeText={setAddress}
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
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
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
