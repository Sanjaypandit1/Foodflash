"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  FlatList,
  useColorScheme,
  StatusBar,
  Platform,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"

// Address type
export type Address = {
  id: string
  name: string
  fullName: string // Added full name field
  address: string
  phone: string
  email: string // Added email field
  isDefault: boolean
}

interface AddressManagerProps {
  onSelectAddress?: (address: Address) => void
  selectedAddressId?: string
  mode?: "select" | "manage" // 'select' for checkout, 'manage' for settings
}

const AddressManager: React.FC<AddressManagerProps> = ({ onSelectAddress, selectedAddressId, mode = "select" }) => {
  const navigation = useNavigation()
  // Use React Native's built-in useColorScheme
  const colorScheme = useColorScheme()
  const isDarkMode = colorScheme === "dark"

  const [addresses, setAddresses] = useState<Address[]>([])
  const [addressModalVisible, setAddressModalVisible] = useState<boolean>(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [newAddressName, setNewAddressName] = useState<string>("")
  const [newAddressFullName, setNewAddressFullName] = useState<string>("")
  const [newAddressText, setNewAddressText] = useState<string>("")
  const [newAddressPhone, setNewAddressPhone] = useState<string>("")
  const [newAddressEmail, setNewAddressEmail] = useState<string>("")
  const [newAddressDefault, setNewAddressDefault] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string | undefined>(selectedAddressId)

  // Add these state variables after the other state declarations (around line 45)
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

  // Load addresses on component mount
  useEffect(() => {
    loadAddresses()
  }, [])

  // Update selected ID when prop changes
  useEffect(() => {
    if (selectedAddressId) {
      setSelectedId(selectedAddressId)
    }
  }, [selectedAddressId])

  // Load addresses from AsyncStorage
  const loadAddresses = async () => {
    try {
      const savedAddresses = await AsyncStorage.getItem("userAddresses")
      if (savedAddresses) {
        const parsedAddresses = JSON.parse(savedAddresses)
        setAddresses(parsedAddresses)

        // If no address is selected, select the default one
        if (!selectedId && parsedAddresses.length > 0 && mode === "select") {
          const defaultAddress = parsedAddresses.find((addr: Address) => addr.isDefault)
          if (defaultAddress) {
            setSelectedId(defaultAddress.id)
            if (onSelectAddress) onSelectAddress(defaultAddress)
          } else {
            setSelectedId(parsedAddresses[0].id)
            if (onSelectAddress) onSelectAddress(parsedAddresses[0])
          }
        }
      }
    } catch (error) {
      console.error("Failed to load addresses:", error)
    }
  }

  // Rest of your component remains the same...
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
    setEditingAddress(null)
    setNewAddressName("")
    setNewAddressFullName("")
    setNewAddressText("")
    setNewAddressPhone("")
    setNewAddressEmail("")
    setNewAddressDefault(false)
    setAddressModalVisible(true)
    setValidationStatus({
      fullName: null,
      address: null,
      phone: null,
      email: null,
      overall: null,
      message: "",
    })
  }

  // Open modal to edit an existing address
  const openEditAddressModal = (address: Address) => {
    setEditingAddress(address)
    setNewAddressName(address.name)
    setNewAddressFullName(address.fullName || "")
    setNewAddressText(address.address)
    setNewAddressPhone(address.phone)
    setNewAddressEmail(address.email || "")
    setNewAddressDefault(address.isDefault)
    setAddressModalVisible(true)
    setValidationStatus({
      fullName: null,
      address: null,
      phone: null,
      email: null,
      overall: null,
      message: "",
    })
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
  const handleSaveAddress = () => {
    // Validate inputs
    if (!validateFields()) {
      return
    }

    let updatedAddresses = [...addresses]

    if (editingAddress) {
      // Editing existing address
      updatedAddresses = updatedAddresses.map((addr) => {
        if (addr.id === editingAddress.id) {
          return {
            ...addr,
            name: newAddressName,
            fullName: newAddressFullName,
            address: newAddressText,
            phone: newAddressPhone,
            email: newAddressEmail,
            isDefault: newAddressDefault,
          }
        }
        // If this address is set as default, remove default from others
        return newAddressDefault ? { ...addr, isDefault: false } : addr
      })
    } else {
      // Adding new address
      const newAddress: Address = {
        id: Date.now().toString(), // Generate unique ID
        name: newAddressName,
        fullName: newAddressFullName,
        address: newAddressText,
        phone: newAddressPhone,
        email: newAddressEmail,
        isDefault: newAddressDefault || addresses.length === 0, // First address is default
      }

      // If new address is default, update other addresses
      if (newAddress.isDefault) {
        updatedAddresses = updatedAddresses.map((addr) => ({
          ...addr,
          isDefault: false,
        }))
      }

      // Add new address to list
      updatedAddresses = [...updatedAddresses, newAddress]

      // Select the new address if in select mode
      if (mode === "select") {
        setSelectedId(newAddress.id)
        if (onSelectAddress) onSelectAddress(newAddress)
      }
    }

    saveAddresses(updatedAddresses)

    // Reset form and close modal
    setEditingAddress(null)
    setNewAddressName("")
    setNewAddressFullName("")
    setNewAddressText("")
    setNewAddressPhone("")
    setNewAddressEmail("")
    setNewAddressDefault(false)
    setValidationStatus({
      fullName: null,
      address: null,
      phone: null,
      email: null,
      overall: null,
      message: "",
    })
    setAddressModalVisible(false)
  }

  // Handle selecting an address
  const handleSelectAddress = (address: Address) => {
    setSelectedId(address.id)
    if (onSelectAddress) onSelectAddress(address)
  }

  // Handle setting an address as default
  const handleSetDefault = (id: string) => {
    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }))
    saveAddresses(updatedAddresses)
  }

  // Handle deleting an address
  const handleDeleteAddress = (id: string) => {
    Alert.alert("Delete Address", "Are you sure you want to delete this address?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          const updatedAddresses = addresses.filter((addr) => addr.id !== id)

          // If we're deleting the selected address, select another one
          if (id === selectedId && updatedAddresses.length > 0 && mode === "select") {
            const newSelectedAddress = updatedAddresses.find((addr) => addr.isDefault) || updatedAddresses[0]
            setSelectedId(newSelectedAddress.id)
            if (onSelectAddress) onSelectAddress(newSelectedAddress)
          }

          // If we're deleting the default address, make another one default
          if (updatedAddresses.length > 0 && !updatedAddresses.some((addr) => addr.isDefault)) {
            updatedAddresses[0].isDefault = true
          }

          saveAddresses(updatedAddresses)
        },
        style: "destructive",
      },
    ])
  }

  // Render address list or selector based on mode
  const renderAddresses = () => {
    if (addresses.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, isDarkMode && styles.darkText]}>No addresses saved yet</Text>
          <TouchableOpacity style={styles.addButton} onPress={openAddAddressModal}>
            <Icon name="add" size={20} color="#FF3F00" />
            <Text style={styles.addButtonText}>Add New Address</Text>
          </TouchableOpacity>
        </View>
      )
    }

    if (mode === "select") {
      // Show address selector (for checkout)
      return (
        <View>
          {addresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              style={[
                styles.addressCard,
                selectedId === address.id && styles.selectedAddressCard,
                isDarkMode && styles.darkAddressCard,
                selectedId === address.id && isDarkMode && styles.darkSelectedAddressCard,
              ]}
              onPress={() => handleSelectAddress(address)}
            >
              <View style={styles.addressHeader}>
                <Text style={[styles.addressName, isDarkMode && styles.darkText]}>{address.name}</Text>
                {address.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.addressText, isDarkMode && styles.darkText]}>{address.fullName}</Text>
              <Text style={[styles.addressText, isDarkMode && styles.darkText]}>{address.address}</Text>
              <Text style={[styles.phoneText, isDarkMode && styles.darkText]}>{address.phone}</Text>
              <Text style={[styles.phoneText, isDarkMode && styles.darkText]}>{address.email}</Text>
              <View style={styles.radioButton}>
                {selectedId === address.id && <View style={styles.radioButtonInner} />}
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.addButton} onPress={openAddAddressModal}>
            <Icon name="add" size={20} color="#FF3F00" />
            <Text style={styles.addButtonText}>Add New Address</Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      // Show address management (for settings)
      return (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.addressCard, isDarkMode && styles.darkAddressCard]}>
              <View style={styles.addressHeader}>
                <Text style={[styles.addressName, isDarkMode && styles.darkText]}>{item.name}</Text>
                {item.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.addressName, isDarkMode && styles.darkText]}>Name: {item.fullName}</Text>
              <Text style={[styles.addressText, isDarkMode && styles.darkText]}>{item.address}</Text>
              <Text style={[styles.phoneText, isDarkMode && styles.darkText]}>Phone: {item.phone}</Text>
              <Text style={[styles.phoneText, isDarkMode && styles.darkText]}>Email: {item.email}</Text>
              <View style={styles.addressActions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => openEditAddressModal(item)}>
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>

                {!item.isDefault && (
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleSetDefault(item.id)}>
                    <Text style={styles.actionButtonText}>Set as Default</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeleteAddress(item.id)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.addressList}
        />
      )
    }
  }

  return (
    <View style={styles.container}>
      {renderAddresses()}

      {/* Add/Edit Address Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addressModalVisible}
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>
                {editingAddress ? "Edit Address" : "Add New Address"}
              </Text>
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
                <Text style={styles.saveButtonText}>{editingAddress ? "Update Address" : "Save Address"}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  // Your existing styles...
  container: {
    width: "100%",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
  },
  safeArea: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    marginBottom: 15,
  },
  darkText: {
    color: "#f0f0f0",
  },
  addressList: {
    width: "100%",
  },
  addressCard: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  darkAddressCard: {
    borderColor: "#444",
    backgroundColor: "#222",
  },
  selectedAddressCard: {
    borderColor: "#FF3F00",
    backgroundColor: "#FFF3EB",
  },
  darkSelectedAddressCard: {
    borderColor: "#FF3F00",
    backgroundColor: "#3A2A20",
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  addressName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  defaultBadge: {
    backgroundColor: "#FF3F00",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  defaultText: {
    color: "white",
    fontSize: 11,
    fontWeight: "500",
  },
  addressText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    paddingRight: 30,
  },
  phoneText: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
    paddingRight: 30,
  },
  radioButton: {
    position: "absolute",
    right: 14,
    top: "50%",
    marginTop: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FF3F00",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF3F00",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 6,
  },
  addButtonText: {
    color: "#FF3F00",
    fontWeight: "600",
    marginLeft: 5,
    fontSize: 15,
  },
  addressActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    flexWrap: "wrap",
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
    marginLeft: 10,
    marginBottom: 5,
  },
  actionButtonText: {
    fontSize: 12,
    color: "#333",
  },
  deleteButton: {
    backgroundColor: "#ffeeee",
  },
  deleteButtonText: {
    color: "#d32f2f",
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

export default AddressManager
