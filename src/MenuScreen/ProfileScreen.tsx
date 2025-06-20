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
  StatusBar,
  Platform,
  Alert,
} from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { type NavigationProp, useNavigation } from "@react-navigation/native"
import { useState } from "react"
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
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+1 234 567 8900",
    address: "123 Main St, City, State 12345",
  })

  const handleSave = () => {
    setIsEditing(false)
    Alert.alert("Success", "Profile updated successfully!")
  }

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
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Icon name="user" size={40} color="#fff" />
          </View>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5EB",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
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
  // Original sign-in prompt styles
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
  // Authenticated user styles
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
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
