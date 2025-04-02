"use client"

import { useEffect, useState } from "react"
import { View, ActivityIndicator, TouchableOpacity, StyleSheet, Text } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Icon from "react-native-vector-icons/FontAwesome"
import type { GestureResponderEvent } from "react-native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { CartProvider, useCart } from "./src/components/CartContext"

// Importing Screens
import HomeScreen from "./src/screens/HomeScreen"
import FavoritesScreen from "./src/screens/FavoritesScreen"
import CartScreen from "./src/screens/CartScreen"
import OrdersScreen from "./src/screens/OrdersScreen"
import MenuScreen from "./src/screens/MenuScreen"
import LanguageSelectionScreen from "./src/FirstPage/Language"
import OnboardingScreen from "./src/FirstPage/OnboardingScreen"
import OnboardingScreen2 from "./src/FirstPage/onboardingscreen2"
import ProductScreen from "./src/subscreen/ProductScreen"
import ProductScreen2 from "./src/subscreen/ProductScreen2"
import ProductScreen3 from "./src/subscreen/ProductScreen3"
import ProductScreen4 from "./src/subscreen/ProductScreen4"
import ProductScreen5 from "./src/subscreen/ProductScreen5"
import Samosa from "./src/subscreen/Samosa"
import Pakoda from "./src/subscreen/Pakoda"


// Type for bottom tab navigator
type TabParamList = {
  Home: undefined
  Favorites: undefined
  Cart: undefined
  Orders: undefined
  Menu: undefined
}

const Stack = createNativeStackNavigator()

// Bottom Tab Navigator
const Tab = createBottomTabNavigator<TabParamList>()

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Homescreen" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProductScreen" component={ProductScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProductScreen2" component={ProductScreen2} options={{ headerShown: false }} />
      <Stack.Screen name="ProductScreen3" component={ProductScreen3} options={{ headerShown: false }} />
      <Stack.Screen name="ProductScreen4" component={ProductScreen4} options={{ headerShown: false }} />
      <Stack.Screen name="ProductScreen5" component={ProductScreen5} options={{ headerShown: false }} />
      <Stack.Screen name="Samosa" component={Samosa} options={{ headerShown: false }} />
      <Stack.Screen name="Pakoda" component={Pakoda} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

// Floating Cart Button Component
const FloatingCartButton = ({ onPress }: { onPress?: (event: GestureResponderEvent) => void }) => {
  const { getCartCount } = useCart()
  const cartCount = getCartCount()

  return (
    <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
      <Icon name="shopping-cart" size={28} color="white" />
      {cartCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cartCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

// Main App Component with Cart Provider
function MainAppWithProvider() {
  return (
    <CartProvider>
      <MainApp />
    </CartProvider>
  )
}

// Main App Component
function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string
          switch (route.name) {
            case "Home":
              iconName = "home"
              break
            case "Favorites":
              iconName = "heart"
              break
            case "Cart":
              iconName = "shopping-cart"
              break
            case "Orders":
              iconName = "shopping-bag"
              break
            case "Menu":
              iconName = "bars"
              break
            default:
              iconName = "circle"
              break
          }
          return <Icon name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "red",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: styles.tabBarStyle,
        tabBarLabel: () => null,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarButton: (props) => <FloatingCartButton onPress={(e) => props.onPress?.(e)} />,
        }}
      />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Menu" component={MenuScreen} />
    </Tab.Navigator>
  )
}

// Wrapper App Component
export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [showLanguageScreen, setShowLanguageScreen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showOnboarding2, setShowOnboarding2] = useState(false)

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasSelectedLanguage = await AsyncStorage.getItem("selectedLanguage")
        const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding")

        if (!hasSelectedLanguage) {
          setShowLanguageScreen(true)
        } else if (!hasSeenOnboarding) {
          // Initially, show the first onboarding screen
          setShowOnboarding(true)
        }
      } catch (error) {
        console.error("Error reading AsyncStorage:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkFirstLaunch()
  }, [])

  const handleLanguageSelection = async () => {
    await AsyncStorage.setItem("selectedLanguage", "true")
    setShowLanguageScreen(false)
    setShowOnboarding(true) // Show onboarding after selecting language
  }

  // Handler for finishing OnboardingScreen1:
  const handleOnboardingFinish = async () => {
    // Option 1: If you want two separate onboarding flows, update state:
    setShowOnboarding(false)
    setShowOnboarding2(true)
  }

  // Handler for finishing OnboardingScreen2:
  const handleOnboardingFinish2 = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true")
    setShowOnboarding2(false)
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F7931A" />
      </View>
    )
  }

  return (
    <CartProvider>
      <NavigationContainer>
        {showLanguageScreen ? (
          <LanguageSelectionScreen onLanguageSelect={handleLanguageSelection} />
        ) : showOnboarding ? (
          <OnboardingScreen onFinish={handleOnboardingFinish} />
        ) : showOnboarding2 ? (
          <OnboardingScreen2 onFinish={handleOnboardingFinish2} />
        ) : (
          <MainApp />
        )}
      </NavigationContainer>
    </CartProvider>
  )
}

// Styles
const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: "white",
    height: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
  },
  floatingButton: {
    top: -25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  badge: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
})

