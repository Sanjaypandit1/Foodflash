"use client"

import type React from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Platform,
  Alert,
  Image,
  Modal,
} from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { type NavigationProp, useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { launchImageLibrary, launchCamera, type ImagePickerResponse, type MediaType } from "react-native-image-picker"
import { request, PERMISSIONS, RESULTS } from "react-native-permissions"
import { useUserContext } from "../Context/UserContex"
import type { User } from "./User"

type RootStackParamList = {
  Settings: undefined
  SignIn: undefined
}

type NavigationProps = NavigationProp<RootStackParamList, "Settings">

interface ProfileScreenProps {
  user?: User
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user }) => {
  const navigation = useNavigation<NavigationProps>()
  const { profileImage, setProfileImage } = useUserContext()
  const [isEditing, setIsEditing] = useState(false)
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+1 234 567 8900",
    address: "123 Main St, City, State 12345",
  })

  const handleSave = async () => {
    setIsEditing(false)
    Alert.alert("Success", "Profile updated successfully!")
  }

  const requestCameraPermission = async () => {
    try {
      const result = await request(Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA)
      return result === RESULTS.GRANTED
    } catch (error) {
      console.log("Permission request error:", error)
      return false
    }
  }

  const requestGalleryPermission = async () => {
    try {
      const result = await request(
        Platform.OS === "ios" ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      )
      return result === RESULTS.GRANTED
    } catch (error) {
      console.log("Permission request error:", error)
      return false
    }
  }

  const selectImageFromGallery = async () => {
    const hasPermission = await requestGalleryPermission()
    if (!hasPermission) {
      Alert.alert("Permission Required", "Please grant gallery access to select photos.")
      return
    }

    const options = {
      mediaType: "photo" as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8 as const,
    }

    launchImageLibrary(options, async (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return
      }

      if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri
        if (imageUri) {
          await setProfileImage(imageUri)
          setShowImagePicker(false)
          Alert.alert("Success", "Profile photo updated!")
        }
      }
    })
  }

  const selectImageFromCamera = async () => {
    const hasPermission = await requestCameraPermission()
    if (!hasPermission) {
      Alert.alert("Permission Required", "Please grant camera access to take photos.")
      return
    }

    const options = {
      mediaType: "photo" as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8 as const,
    }

    launchCamera(options, async (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return
      }

      if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri
        if (imageUri) {
          await setProfileImage(imageUri)
          setShowImagePicker(false)
          Alert.alert("Success", "Profile photo updated!")
        }
      }
    })
  }

  const removeProfileImage = () => {
    Alert.alert("Remove Photo", "Are you sure you want to remove your profile photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          await setProfileImage(null)
          setShowImagePicker(false)
          Alert.alert("Success", "Profile photo removed!")
        },
      },
    ])
  }

  // Get the current profile image (priority: context > user.photoURL > null)
  const getCurrentProfileImage = () => {
    return profileImage || user?.photoURL || null
  }

  // Image Picker Modal Component
  const ImagePickerModal = () => (
    <Modal
      visible={showImagePicker}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowImagePicker(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Profile Photo</Text>

          <TouchableOpacity style={styles.modalOption} onPress={selectImageFromCamera}>
            <Icon name="camera" size={24} color="#333" />
            <Text style={styles.modalOptionText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalOption} onPress={selectImageFromGallery}>
            <Icon name="image" size={24} color="#333" />
            <Text style={styles.modalOptionText}>Choose from Gallery</Text>
          </TouchableOpacity>

          {getCurrentProfileImage() && (
            <TouchableOpacity style={styles.modalOption} onPress={removeProfileImage}>
              <Icon name="trash-2" size={24} color="#FF6B6B" />
              <Text style={[styles.modalOptionText, { color: "#FF6B6B" }]}>Remove Photo</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.modalCancelButton} onPress={() => setShowImagePicker(false)}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

  // If user is not signed in, show sign-in prompt
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>User Profile</Text>
            <Text style={styles.cardText}>Please sign in to view and edit your profile information.</Text>

            <TouchableOpacity style={styles.signInButton} onPress={() => navigation.navigate("SignIn")}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

  // If user is signed in, show profile
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Icon name={isEditing ? "x" : "edit"} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Header with Photo Upload */}
        <View style={styles.profileHeader}>
          <TouchableOpacity style={styles.avatarContainer} onPress={() => setShowImagePicker(true)}>
            {getCurrentProfileImage() ? (
              <Image source={{ uri: getCurrentProfileImage()! }} style={styles.avatarImage} />
            ) : (
              <Icon name="user" size={40} color="#fff" />
            )}
            <View style={styles.cameraIconContainer}>
              <Icon name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
          <Text style={styles.photoHint}>Tap photo to change</Text>
        </View>

        {/* Profile Information */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoTitle}>Profile Information</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Icon name="user" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={profileData.name}
                onChangeText={(text) => setProfileData((prev) => ({ ...prev, name: text }))}
                editable={isEditing}
                placeholder="Full Name"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Icon name="mail" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={profileData.email}
                onChangeText={(text) => setProfileData((prev) => ({ ...prev, email: text }))}
                editable={isEditing}
                placeholder="Email Address"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <Icon name="phone" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={profileData.phone}
                onChangeText={(text) => setProfileData((prev) => ({ ...prev, phone: text }))}
                editable={isEditing}
                placeholder="Phone Number"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Address</Text>
            <View style={styles.inputContainer}>
              <Icon name="map-pin" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={profileData.address}
                onChangeText={(text) => setProfileData((prev) => ({ ...prev, address: text }))}
                editable={isEditing}
                placeholder="Address"
                multiline
              />
            </View>
          </View>

          {isEditing && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Account Statistics */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Account Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Orders Placed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>150</Text>
              <Text style={styles.statLabel}>Loyalty Points</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Image Picker Modal */}
      <ImagePickerModal />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5EB",
  },
  header: {
    backgroundColor: "red",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    elevation: 4,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: "red",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  signInText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  profileHeader: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    position: "relative",
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#333",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  photoHint: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
  },
  modalCancelButton: {
    marginTop: 10,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
  },
  modalCancelText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "red",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "red",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
})

export default ProfileScreen
