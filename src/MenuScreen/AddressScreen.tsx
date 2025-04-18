import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AddressManager, { Address } from './Address1';
import { useColorScheme } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the navigation type
type RootStackParamList = {
  Home: undefined;
  AddressScreen: undefined;
  Settings: undefined;
  // Add other screens as needed
};

type AddressScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddressScreen'>;

interface AddressScreenProps {
  navigation: AddressScreenNavigationProp;
}

const AddressScreen: React.FC<AddressScreenProps> = ({ navigation }) => {
  // Use React Native's built-in useColorScheme instead of @react-navigation/native's useTheme
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // State for the add address modal
  const [addressModalVisible, setAddressModalVisible] = useState<boolean>(false);
  const [newAddressName, setNewAddressName] = useState<string>('');
  const [newAddressText, setNewAddressText] = useState<string>('');
  const [newAddressPhone, setNewAddressPhone] = useState<string>('');
  const [newAddressDefault, setNewAddressDefault] = useState<boolean>(false);
  const [addresses, setAddresses] = useState<Address[]>([]);

  // Load addresses from AsyncStorage
  const loadAddresses = async () => {
    try {
      const savedAddresses = await AsyncStorage.getItem('userAddresses');
      if (savedAddresses) {
        const parsedAddresses = JSON.parse(savedAddresses);
        setAddresses(parsedAddresses);
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
    }
  };

  // Save addresses to AsyncStorage
  const saveAddresses = async (updatedAddresses: Address[]) => {
    try {
      await AsyncStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
      setAddresses(updatedAddresses);
    } catch (error) {
      console.error('Failed to save addresses:', error);
    }
  };

  // Open modal to add a new address
  const openAddAddressModal = () => {
    setNewAddressName('');
    setNewAddressText('');
    setNewAddressPhone('');
    setNewAddressDefault(false);
    setAddressModalVisible(true);
  };

  // Handle saving a new address
  const handleSaveAddress = async () => {
    // Validate inputs
    if (!newAddressName.trim() || !newAddressText.trim() || !newAddressPhone.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    try {
      // Load current addresses
      const savedAddresses = await AsyncStorage.getItem('userAddresses');
      let currentAddresses: Address[] = savedAddresses ? JSON.parse(savedAddresses) : [];
      
      // Create new address
      const newAddress: Address = {
        id: Date.now().toString(),
        name: newAddressName,
        address: newAddressText,
        phone: newAddressPhone,
        isDefault: newAddressDefault || currentAddresses.length === 0,
      };

      // If new address is default, update other addresses
      if (newAddress.isDefault) {
        currentAddresses = currentAddresses.map(addr => ({
          ...addr,
          isDefault: false,
        }));
      }

      // Add new address to list
      const updatedAddresses = [...currentAddresses, newAddress];
      
      // Save updated addresses
      await AsyncStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
      
      // Close modal and refresh AddressManager
      setAddressModalVisible(false);
      
      // Force refresh of the AddressManager component
      // This is a simple way to trigger a refresh - in a real app you might use context or state management
      navigation.navigate('AddressScreen');
    } catch (error) {
      console.error('Failed to save address:', error);
      Alert.alert('Error', 'Failed to save address. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Addresses</Text>
        <View style={{width: 24}} />
      </View>

      {/* Add Address Button */}
      <TouchableOpacity 
        style={[styles.addAddressButton, isDarkMode && styles.darkAddAddressButton]}
        onPress={openAddAddressModal}>
        <Icon name="add-location" size={22} color="#fff" />
        <Text style={styles.addAddressButtonText}>Add New Address</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <AddressManager mode="manage" />
      </View>

      {/* Add Address Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addressModalVisible}
        onRequestClose={() => setAddressModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>
                Add New Address
              </Text>
              <TouchableOpacity
                onPress={() => setAddressModalVisible(false)}>
                <Icon name="close" size={24} color={isDarkMode ? "#fff" : "#333"} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Address Name</Text>
                <TextInput
                  style={[styles.formInput, isDarkMode && styles.darkFormInput]}
                  placeholder="Home, Work, etc."
                  placeholderTextColor={isDarkMode ? "#888" : "#aaa"}
                  value={newAddressName}
                  onChangeText={setNewAddressName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Full Address</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea, isDarkMode && styles.darkFormInput]}
                  placeholder="Enter your full address"
                  placeholderTextColor={isDarkMode ? "#888" : "#aaa"}
                  value={newAddressText}
                  onChangeText={setNewAddressText}
                  multiline={true}
                  numberOfLines={3}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Phone Number</Text>
                <TextInput
                  style={[styles.formInput, isDarkMode && styles.darkFormInput]}
                  placeholder="Enter your phone number"
                  placeholderTextColor={isDarkMode ? "#888" : "#aaa"}
                  value={newAddressPhone}
                  onChangeText={setNewAddressPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formCheckbox}>
                <TouchableOpacity
                  style={[styles.checkbox, newAddressDefault && styles.checkedCheckbox]}
                  onPress={() => setNewAddressDefault(!newAddressDefault)}>
                  {newAddressDefault && (
                    <Icon name="check" size={16} color="#FF3F00" />
                  )}
                </TouchableOpacity>
                <Text style={[styles.checkboxLabel, isDarkMode && styles.darkText]}>
                  Set as default address
                </Text>
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveAddress}>
                <Text style={styles.saveButtonText}>Save Address</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    backgroundColor: '#FF3F00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 30,
    elevation: 4,
  },
  darkHeader: {
    backgroundColor: '#8B0000',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3F00',
    marginHorizontal: 15,
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 2,
  },
  darkAddAddressButton: {
    backgroundColor: '#8B0000',
  },
  addAddressButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  darkModalContent: {
    backgroundColor: '#222',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  darkText: {
    color: '#f0f0f0',
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    color: '#333',
  },
  darkFormInput: {
    borderColor: '#444',
    backgroundColor: '#333',
    color: '#f0f0f0',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  formCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCheckbox: {
    borderColor: '#FF3F00',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#555',
  },
  saveButton: {
    backgroundColor: '#FF3F00',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddressScreen;