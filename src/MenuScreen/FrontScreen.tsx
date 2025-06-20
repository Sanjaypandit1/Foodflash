"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  SafeAreaView,
  Dimensions,
} from "react-native"
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import Icon from "react-native-vector-icons/Feather"
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import { useUserContext } from "../Context/UserContex"
import type { User } from "../MenuScreen/User"

// Get screen dimensions for responsive layout
const { width, height } = Dimensions.get("window")

// Navigation types
type RootStackParamList = {
  SignIn: undefined
  SignUp: undefined
  FrontScreen: { user?: any }
  Profile: undefined
  Address: undefined
  LanguageSelectionScreen: undefined
  Coupons: undefined
  LoyaltyPoints: undefined
  Wallet: undefined
  Refer: undefined
  Support: undefined
  About: undefined
  Terms: undefined
  Privacy: undefined
  Refund: undefined
  Cancellation: undefined
  MainTabs: undefined
}

type FrontScreenRouteProp = RouteProp<RootStackParamList, "FrontScreen">
type NavigationProps = NativeStackNavigationProp<RootStackParamList>

// Define types for menu items
interface MenuItem {
  id: number
  title: string
  icon: string
  iconType?: "feather" | "material" | "fontawesome"
  toggle?: boolean
  onPress?: () => void
}

// Menu Item Component Props
interface MenuItemProps {
  title: string
  icon: string
  iconType?: "feather" | "material" | "fontawesome"
  toggle?: boolean
  isLast?: boolean
  onPress?: () => void
}

// Menu Section Component Props
interface MenuSectionProps {
  title: string
  items: MenuItem[]
}

interface FrontScreenProps {
  user?: User | null
  onSignOut?: () => Promise<void>
}

// Menu Item Component
const MenuItem: React.FC<MenuItemProps> = ({ title, icon, iconType = "feather", toggle, isLast, onPress }) => {
  const [isEnabled, setIsEnabled] = useState(false)
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState)

  const renderIcon = () => {
    switch (iconType) {
      case "material":
        return <MaterialIcon name={icon} size={20} color="#000" style={styles.menuIcon} />
      case "fontawesome":
        return <FontAwesome name={icon} size={20} color="#000" style={styles.menuIcon} />
      default:
        return <Icon name={icon} size={20} color="#000" style={styles.menuIcon} />
    }
  }

  return (
    <TouchableOpacity style={[styles.menuItem, isLast ? styles.lastMenuItem : null]} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        {renderIcon()}
        <Text style={styles.menuText}>{title}</Text>
      </View>
      {toggle && (
        <Switch
          trackColor={{ false: "#f4f3f4", true: "#FFC8A2" }}
          thumbColor={isEnabled ? "#FF8C00" : "#f4f3f4"}
          ios_backgroundColor="#f4f3f4"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      )}
    </TouchableOpacity>
  )
}

// Menu Section Component
const MenuSection: React.FC<MenuSectionProps> = ({ title, items }) => {
  return (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.menuContainer}>
        {items.map((item, index) => (
          <MenuItem
            key={item.id}
            title={item.title}
            icon={item.icon}
            iconType={item.iconType}
            toggle={item.toggle}
            isLast={index === items.length - 1}
            onPress={item.onPress}
          />
        ))}
      </View>
    </View>
  )
}

const FrontScreen: React.FC<FrontScreenProps> = ({ user: propUser, onSignOut }) => {
  const navigation = useNavigation<NavigationProps>()
  const route = useRoute<FrontScreenRouteProp>()
  const { profileImage } = useUserContext()

  // Use user from route params if available, otherwise use prop
  const user = route.params?.user || propUser

  // Get user display name with better fallback logic
  const getUserDisplayName = () => {
    if (!user) return "Guest User"

    // Priority: displayName > name > email (before @) > "User"
    if (user.displayName) return user.displayName
    if (user.name) return user.name
    if (user.email) {
      const emailName = user.email.split("@")[0]
      return emailName.charAt(0).toUpperCase() + emailName.slice(1)
    }
    return "User"
  }

  // Get profile image with proper fallback logic
  const getProfileImage = () => {
    // For authenticated users: priority is saved profile image > user.photoURL > logo
    if (user) {
      return profileImage || user.photoURL || require("../Assets/logo.jpg")
    }
    // For guest users: always show logo
    return require("../Assets/logo.jpg")
  }

  // Profile Header Component
  const ProfileHeader: React.FC = () => {
    const imageSource = getProfileImage()
    const isUri = typeof imageSource === "string"

    return (
      <TouchableOpacity onPress={() => (user ? navigation.navigate("Profile") : navigation.navigate("SignIn"))}>
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <Image source={isUri ? { uri: imageSource } : imageSource} style={styles.profileImage} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{getUserDisplayName()}</Text>
              <Text style={styles.profileSubtitle}>
                {user ? user.email || "Welcome back!" : "Tap here to sign in and unlock all features"}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  // Sign In/Out Button Component
  const AuthButton: React.FC = () => {
    const handleSignOut = async () => {
      if (onSignOut) {
        await onSignOut()
      }
    }

    if (user) {
      return (
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <FontAwesome name="sign-out" size={20} color="#fff" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      )
    }

    return (
      <TouchableOpacity style={styles.signInButton} onPress={() => navigation.navigate("SignIn")}>
        <FontAwesome name="sign-in" size={20} color="#fff" />
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>
    )
  }

  // Define menu items
  const generalItems: MenuItem[] = [
    {
      id: 1,
      title: "Profile",
      icon: "user",
      onPress: () => (user ? navigation.navigate("Profile") : navigation.navigate("SignIn")),
    },
    {
      id: 2,
      title: "My Address",
      icon: "map-pin",
      onPress: () => (user ? navigation.navigate("Address") : navigation.navigate("SignIn")),
    },
    {
      id: 3,
      title: "Language",
      icon: "globe",
      onPress: () => navigation.navigate("LanguageSelectionScreen"),
    },
    {
      id: 4,
      title: "Dark Mode",
      icon: "moon",
      toggle: true,
    },
  ]

  const promotionalItems: MenuItem[] = [
    {
      id: 1,
      title: "Coupon",
      icon: "ticket",
      iconType: "material",
      onPress: () => (user ? navigation.navigate("Coupons") : navigation.navigate("SignIn")),
    },
    {
      id: 2,
      title: "Loyalty Points",
      icon: "star",
      onPress: () => (user ? navigation.navigate("LoyaltyPoints") : navigation.navigate("SignIn")),
    },
    {
      id: 3,
      title: "My Wallet",
      icon: "credit-card",
      onPress: () => (user ? navigation.navigate("Wallet") : navigation.navigate("SignIn")),
    },
  ]

  const earningItems: MenuItem[] = [
    {
      id: 1,
      title: "Refer & Earn",
      icon: "users",
      onPress: () => (user ? navigation.navigate("Refer") : navigation.navigate("SignIn")),
    },
  ]

  const helpSupportItems: MenuItem[] = [
    {
      id: 1,
      title: "Help & Support",
      icon: "headphones",
      iconType: "feather",
      onPress: () => navigation.navigate("Support"),
    },
    {
      id: 2,
      title: "About Us",
      icon: "info",
      iconType: "feather",
      onPress: () => navigation.navigate("About"),
    },
    {
      id: 3,
      title: "Terms & Condition",
      icon: "file-text",
      iconType: "feather",
      onPress: () => navigation.navigate("Terms"),
    },
    {
      id: 4,
      title: "Privacy Policy",
      icon: "shield",
      iconType: "feather",
      onPress: () => navigation.navigate("Privacy"),
    },
    {
      id: 5,
      title: "Refund Policy",
      icon: "refresh-cw",
      iconType: "feather",
      onPress: () => navigation.navigate("Refund"),
    },
    {
      id: 6,
      title: "Cancellation Policy",
      icon: "x-circle",
      iconType: "feather",
      onPress: () => navigation.navigate("Cancellation"),
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <MenuSection title="General" items={generalItems} />
        <MenuSection title="Promotional Activity" items={promotionalItems} />
        <MenuSection title="Earnings" items={earningItems} />
        <MenuSection title="Help & Support" items={helpSupportItems} />

        <AuthButton />

        {/* Add extra space at the bottom to ensure content isn't hidden behind tab navigation */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  )
}

// Styles (same as before)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5EB",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 80,
  },
  header: {
    backgroundColor: "red",
    paddingTop: 10,
    paddingBottom: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
  },
  profileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  profileSubtitle: {
    fontSize: 14,
    color: "#fff",
    marginTop: 2,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  menuSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "red",
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 15,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
  },
  signInButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    borderRadius: 25,
    paddingVertical: 12,
    marginHorizontal: 100,
    marginTop: 20,
    marginBottom: 20,
  },
  signInText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    borderRadius: 25,
    paddingVertical: 12,
    marginHorizontal: 100,
    marginTop: 20,
    marginBottom: 20,
  },
  signOutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  bottomSpacer: {
    height: 20,
  },
})

export default FrontScreen
