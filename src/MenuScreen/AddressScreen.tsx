"use client"

import type React from "react"
import { useState } from "react"
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
  StatusBar,
  Platform,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import AddressManager, { type Address } from "./Address1"
import { useColorScheme } from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Define the navigation type
type RootStackParamList = {
  Home: undefined
  AddressScreen: undefined
  Settings: undefined
  // Add other screens as needed
}

type AddressScreenNavigationProp = StackNavigationProp<RootStackParamList, "AddressScreen">

interface AddressScreenProps {
  navigation: AddressScreenNavigationProp
}

const AddressScreen: React.FC<AddressScreenProps> = ({ navigation }) => {
  // Use React Native's built-in useColorScheme instead of @react-navigation/native's useTheme
  const colorScheme = useColorScheme()
  const isDarkMode = colorScheme === "dark"

  // State for the add address modal
  const [addressModalVisible, setAddressModalVisible] = useState<boolean>(false)
  const [newAddressName, setNewAddressName] = useState<string>("")
  const [newAddressText, setNewAddressText] = useState<string>("")
  const [newAddressPhone, setNewAddressPhone] = useState<string>("")
  const [newAddressDefault, setNewAddressDefault] = useState<boolean>(false)
  const [addresses, setAddresses] = useState<Address[]>([])

  // Add state variables for the new fields
  const [newAddressFullName, setNewAddressFullName] = useState<string>("")
  const [newAddressEmail, setNewAddressEmail] = useState<string>("")

  // Add this state variable after the other state declarations (around line 40)
  const [validationStatus, setValidationStatus] = useState<{
    fullName: boolean | null
    address: boolean | null
    phone: boolean | null
    email: boolean | null
    overall: boolean | null
    message: string
  }>({
    fullName: null,
    address: null,
    phone: null,
    email: null,
    overall: null,
    message: "",
  })

  // Load addresses from AsyncStorage
  const loadAddresses = async () => {
    try {
      const savedAddresses = await AsyncStorage.getItem("userAddresses")
      if (savedAddresses) {
        const parsedAddresses = JSON.parse(savedAddresses)
        setAddresses(parsedAddresses)
      }
    } catch (error) {
      console.error("Failed to load addresses:", error)
    }
  }

  // Save addresses to AsyncStorage
  const saveAddresses = async (updatedAddresses: Address[]) => {
    try {
      await AsyncStorage.setItem("userAddresses", JSON.stringify(updatedAddresses))
      setAddresses(updatedAddresses)
    } catch (error) {
      console.error("Failed to save addresses:", error)
    }
  }

  // Open modal to add a new address
  const openAddAddressModal = () => {
    setNewAddressName("")
    setNewAddressFullName("")
    setNewAddressText("")
    setNewAddressPhone("")
    setNewAddressEmail("")
    setNewAddressDefault(false)
    setAddressModalVisible(true)
  }

  // Add this function before the handleSaveAddress function
  const validateFields = () => {
    // Reset validation status
    const newStatus = {
      fullName: null as boolean | null,
      address: null as boolean | null,
      phone: null as boolean | null,
      email: null as boolean | null,
      overall: null as boolean | null,
      message: "",
    }

    // Validate full name
    if (!newAddressFullName.trim()) {
      newStatus.fullName = false
      newStatus.message = "Full name is required"
      setValidationStatus(newStatus)
      return false
    }
    newStatus.fullName = true

    // Validate address
    if (!newAddressText.trim()) {
      newStatus.address = false
      newStatus.message = "Address is required"
      setValidationStatus(newStatus)
      return false
    }
    newStatus.address = true

    // Validate phone number
    const phoneRegex = /^\+977\d{10}$/
    if (!phoneRegex.test(newAddressPhone)) {
      newStatus.phone = false
      newStatus.message = "Phone number must start with +977 followed by 10 digits"
      setValidationStatus(newStatus)
      return false
    }
    newStatus.phone = true

    // Validate email
    const emailRegex = /^[^\s@]+@gmail\.com$/i
    if (!emailRegex.test(newAddressEmail)) {
      newStatus.email = false
      newStatus.message = "Please enter a valid Gmail address"
      setValidationStatus(newStatus)
      return false
    }
    newStatus.email = true

    // All validations passed
    newStatus.overall = true
    newStatus.message = "All fields are valid"
    setValidationStatus(newStatus)
    return true
  }

  // Modify the handleSaveAddress function to use the validateFields function
  const handleSaveAddress = async () => {
    // Validate inputs
    if (!validateFields()) {
      return
    }

    try {
      // Load current addresses
      const savedAddresses = await AsyncStorage.getItem("userAddresses")
      let currentAddresses: Address[] = savedAddresses ? JSON.parse(savedAddresses) : []

      // Create new address
      const newAddress: Address = {
        id: Date.now().toString(),
        name: newAddressName,
        fullName: newAddressFullName,
        address: newAddressText,
        phone: newAddressPhone,
        email: newAddressEmail,
        isDefault: newAddressDefault || currentAddresses.length === 0,
      }

      // If new address is default, update other addresses
      if (newAddress.isDefault) {
        currentAddresses = currentAddresses.map((addr) => ({
          ...addr,
          isDefault: false,
        }))
      }

      // Add new address to list
      const updatedAddresses = [...currentAddresses, newAddress]

      // Save updated addresses
      await AsyncStorage.setItem("userAddresses", JSON.stringify(updatedAddresses))

      // Close modal and refresh AddressManager
      setAddressModalVisible(false)

      // Reset validation status
      setValidationStatus({
        fullName: null,
        address: null,
        phone: null,
        email: null,
        overall: null,
        message: "",
      })

      // Force refresh of the AddressManager component
      // This is a simple way to trigger a refresh - in a real app you might use context or state management
      navigation.navigate("AddressScreen")
    } catch (error) {
      console.error("Failed to save address:", error)
      Alert.alert("Error", "Failed to save address. Please try again.")
    }
  }

  // Add these functions to validate on blur
  const validateFullName = () => {
    const isValid = newAddressFullName.trim().length > 0
    setValidationStatus((prev) => ({
      ...prev,
      fullName: isValid,
      message: isValid ? prev.message : "Full name is required",
    }))
  }

  const validateAddress = () => {
    const isValid = newAddressText.trim().length > 0
    setValidationStatus((prev) => ({
      ...prev,
      address: isValid,
      message: isValid ? prev.message : "Address is required",
    }))
  }

  const validatePhone = () => {
    const phoneRegex = /^\+977\d{10}$/
    const isValid = phoneRegex.test(newAddressPhone)
    setValidationStatus((prev) => ({
      ...prev,
      phone: isValid,
      message: isValid ? prev.message : "Phone number must start with +977 followed by 10 digits",
    }))
  }

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@gmail\.com$/i
    const isValid = emailRegex.test(newAddressEmail)
    setValidationStatus((prev) => ({
      ...prev,
      email: isValid,
      message: isValid ? prev.message : "Please enter a valid Gmail address",
    }))
  }

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Addresses</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Add Address Button */}
      <TouchableOpacity
        style={[styles.addAddressButton, isDarkMode && styles.darkAddAddressButton]}
        onPress={openAddAddressModal}
      >
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
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>Add New Address</Text>
              <TouchableOpacity onPress={() => setAddressModalVisible(false)}>
                <Icon name="close" size={24} color={isDarkMode ? "#fff" : "#333"} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {validationStatus.overall === false && (
                <View style={styles.validationErrorContainer}>
                  <Icon name="error-outline" size={20} color="#d32f2f" />
                  <Text style={styles.validationErrorText}>{validationStatus.message}</Text>
                </View>
              )}

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
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Full Name</Text>
                <TextInput
                  style={[
                    styles.formInput,
                    isDarkMode && styles.darkFormInput,
                    validationStatus.fullName === false && styles.inputError,
                  ]}
                  placeholder="Enter your full name"
                  placeholderTextColor={isDarkMode ? "#888" : "#aaa"}
                  value={newAddressFullName}
                  onChangeText={setNewAddressFullName}
                  onBlur={validateFullName}
                />
                {validationStatus.fullName === false && (
                  <View style={styles.fieldErrorContainer}>
                    <Icon name="error-outline" size={16} color="#d32f2f" />
                    <Text style={styles.fieldErrorText}>Full name is required</Text>
                  </View>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Full Address</Text>
                <TextInput
                  style={[
                    styles.formInput,
                    styles.textArea,
                    isDarkMode && styles.darkFormInput,
                    validationStatus.address === false && styles.inputError,
                  ]}
                  placeholder="Enter your full address with landmarks"
                  placeholderTextColor={isDarkMode ? "#888" : "#aaa"}
                  value={newAddressText}
                  onChangeText={setNewAddressText}
                  multiline={true}
                  numberOfLines={3}
                  onBlur={validateAddress}
                />
                {validationStatus.address === false && (
                  <View style={styles.fieldErrorContainer}>
                    <Icon name="error-outline" size={16} color="#d32f2f" />
                    <Text style={styles.fieldErrorText}>Address is required</Text>
                  </View>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Phone Number</Text>
                <TextInput
                  style={[
                    styles.formInput,
                    isDarkMode && styles.darkFormInput,
                    validationStatus.phone === false && styles.inputError,
                  ]}
                  placeholder="+977 XXXXXXXXXX"
                  placeholderTextColor={isDarkMode ? "#888" : "#aaa"}
                  value={newAddressPhone}
                  onChangeText={(text) => {
                    // Ensure the phone number starts with +977
                    if (!text.startsWith("+977") && text.length > 0) {
                      text = "+977" + text.replace(/^\+977/, "")
                    }
                    // Limit to +977 followed by 10 digits
                    if (text.startsWith("+977")) {
                      const digits = text.substring(4)
                      if (digits.length <= 10) {
                        setNewAddressPhone(text)
                      }
                    } else {
                      setNewAddressPhone(text)
                    }
                  }}
                  keyboardType="phone-pad"
                  maxLength={14} // +977 + 10 digits
                  onBlur={validatePhone}
                />
                {validationStatus.phone === false && (
                  <View style={styles.fieldErrorContainer}>
                    <Icon name="error-outline" size={16} color="#d32f2f" />
                    <Text style={styles.fieldErrorText}>Phone number must start with +977 followed by 10 digits</Text>
                  </View>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Email Address</Text>
                <TextInput
                  style={[
                    styles.formInput,
                    isDarkMode && styles.darkFormInput,
                    validationStatus.email === false && styles.inputError,
                  ]}
                  placeholder="example@gmail.com"
                  placeholderTextColor={isDarkMode ? "#888" : "#aaa"}
                  value={newAddressEmail}
                  onChangeText={setNewAddressEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={validateEmail}
                />
                {validationStatus.email === false && (
                  <View style={styles.fieldErrorContainer}>
                    <Icon name="error-outline" size={16} color="#d32f2f" />
                    <Text style={styles.fieldErrorText}>Please enter a valid Gmail address</Text>
                  </View>
                )}
              </View>

              <View style={styles.formCheckbox}>
                <TouchableOpacity
                  style={[styles.checkbox, newAddressDefault && styles.checkedCheckbox]}
                  onPress={() => setNewAddressDefault(!newAddressDefault)}
                >
                  {newAddressDefault && <Icon name="check" size={16} color="#FF3F00" />}
                </TouchableOpacity>
                <Text style={[styles.checkboxLabel, isDarkMode && styles.darkText]}>Set as default address</Text>
              </View>

              <View style={styles.validationSummary}>
                <Text
                  style={[
                    styles.validationSummaryText,
                    validationStatus.overall === true
                      ? styles.validText
                      : validationStatus.overall === false
                        ? styles.invalidText
                        : styles.neutralText,
                  ]}
                >
                  {validationStatus.overall === true
                    ? "✓ Address information is valid"
                    : validationStatus.overall === false
                      ? "✗ " + validationStatus.message
                      : "Please fill in all required fields"}
                </Text>
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
                <Text style={styles.saveButtonText}>Save Address</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
  },
  safeArea: {
    flex: 1,
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  header: {
    backgroundColor: "red",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    elevation: 4,
  },
  darkHeader: {
    backgroundColor: "#8B0000",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  content: {
    flex: 1,
    padding: 15,
  },
  addAddressButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    marginHorizontal: 15,
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 2,
  },
  darkAddAddressButton: {
    backgroundColor: "#8B0000",
  },
  addAddressButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  darkModalContent: {
    backgroundColor: "#222",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  darkText: {
    color: "#f0f0f0",
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    color: "#333",
  },
  darkFormInput: {
    borderColor: "#444",
    backgroundColor: "#333",
    color: "#f0f0f0",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  formCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkedCheckbox: {
    borderColor: "#FF3F00",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#555",
  },
  saveButton: {
    backgroundColor: "#FF3F00",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  inputError: {
    borderColor: "#d32f2f",
    borderWidth: 1.5,
  },
  validationErrorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffebee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  validationErrorText: {
    color: "#d32f2f",
    marginLeft: 8,
    fontSize: 14,
  },
  validationSummary: {
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
  },
  validationSummaryText: {
    fontSize: 14,
    textAlign: "center",
  },
  validText: {
    color: "#2e7d32",
  },
  invalidText: {
    color: "#d32f2f",
  },
  neutralText: {
    color: "#757575",
  },
  fieldErrorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    paddingHorizontal: 4,
  },
  fieldErrorText: {
    color: "#d32f2f",
    fontSize: 12,
    marginLeft: 6,
  },
})

export default AddressScreen
