// Updated App.tsx - Add this import at the very top
import './src/Language/Setup'; // Import i18n configuration

"use client"

import { useEffect, useState } from "react"
import { View, ActivityIndicator, TouchableOpacity, StyleSheet, Text } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Icon from "react-native-vector-icons/FontAwesome"
import type { GestureResponderEvent } from "react-native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import auth from "@react-native-firebase/auth"
import { Alert } from "react-native"
import { useTranslation } from 'react-i18next' // Add this import

import { CartProvider, useCart } from "./src/components/CartContext"
import { OrderProvider } from "./src/components/OrderContext"
import CategoryItems from "./src/components/CategoryItem"
import { UserProvider } from "./src/Context/UserContex"

// Keep all your existing imports exactly as they are
import HomeScreen from "./src/screens/HomeScreen"
import FavoritesScreen from "./src/screens/favorites-screen"
import CartScreen from "./src/screens/CartScreen"
import OrdersScreen from "./src/screens/OrdersScreen"
import LanguageSelectionScreen from "./src/FirstPage/Language"
import OnboardingScreen from "./src/FirstPage/OnboardingScreen"
import OnboardingScreen2 from "./src/FirstPage/onboardingscreen2"
import LocationSelectionScreen from "./src/FirstPage/LocationScreen"

// Auth Screens
import FirebaseAuthScreen from "./src/MenuScreen/Auth"
import FirebaseSignUpScreen from "./src/MenuScreen/SigninScreen"

// Menu Screens
import MenuScreen from "./src/screens/MenuScreen"
import DeliciousBite from "./src/Resturant/DelicioueBite"
import BurgerJoint from "./src/Resturant/BurgerJoint"
import SpiceGarden from "./src/Resturant/SpiceGarden"
import SushilPalace from "./src/Resturant/SushiPalace"
import FoodItemDetail from "./src/components/ProductDetails"
import CheckoutScreen from "./src/screens/CheckoutScreen"
import AddressScreen from "./src/MenuScreen/AddressScreen"
import ProfileScreen from "./src/MenuScreen/ProfileScreen"
import CouponsScreen from "./src/MenuScreen/CouponsScreen"
import LoyaltyPointsScreen from "./src/MenuScreen/LoyaltyPointScreen"
import WalletScreen from "./src/MenuScreen/WalletScreen"
import ReferScreen from "./src/MenuScreen/ReferScreen"
import SupportScreen from "./src/MenuScreen/SupportScreen"
import AboutScreen from "./src/MenuScreen/AboutScreen"
import TermsScreen from "./src/MenuScreen/TermsScreen"
import PrivacyScreen from "./src/MenuScreen/PrivacyScreen"
import RefundScreen from "./src/MenuScreen/RefundScreen"
import CancellationScreen from "./src/MenuScreen/CancellationScreen"
import AllCategories from "./src/components/AllCategories"

// Import FrontScreen component
import FrontScreen from "./src/MenuScreen/FrontScreen"

import type { User } from "./src/MenuScreen/User"

// Keep all your existing types
interface ExtendedUser extends User {
  id: string
}

type TabParamList = {
  Home: undefined
  Favorites: undefined
  Cart: undefined
  Orders: undefined
  Menu: undefined
}

type RootStackParamList = {
  MainTabs: undefined
  SignIn: undefined
  SignUp: undefined
  FrontScreen: { user?: any }
  LanguageSelectionScreen: undefined
  LocationSelectionScreen: undefined
  AddressScreen: undefined
  Settings: undefined
  Profile: undefined
  Address: undefined
  Language: undefined
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
  Home: undefined
  Orders: undefined
  Cart: undefined
  CategoryItems: undefined
  FoodItemDetail: {
    item: {
      id: string
      name: string
      price: string
      description: string
      image: { uri: string }
      isVeg: boolean
      rating: string
      preparationTime: string
    }
    restaurantName?: string
  }
}

const Stack = createNativeStackNavigator<RootStackParamList>()
const HomeStack = createNativeStackNavigator()
const FavoritesStack = createNativeStackNavigator()
const MenuStack = createNativeStackNavigator()

// Keep all your existing stack navigators exactly as they are
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Homescreen" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="DeliciousBite" component={DeliciousBite} options={{ headerShown: false, title: "" }} />
      <HomeStack.Screen name="BurgerJoint" component={BurgerJoint} options={{ headerShown: false, title: "" }} />
      <HomeStack.Screen name="SpiceGarden" component={SpiceGarden} options={{ headerShown: false, title: "" }} />
      <HomeStack.Screen name="SushilPalace" component={SushilPalace} options={{ headerShown: false, title: "" }} />
      <HomeStack.Screen name="FoodItemDetail" component={FoodItemDetail} options={{ headerShown: false }} />
      <HomeStack.Screen name="CategoryItems" component={CategoryItems} options={{ headerShown: false }} />
      <HomeStack.Screen name="CheckoutScreen" component={CheckoutScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="AllCategories" component={AllCategories} options={{ headerShown: false }} />
    </HomeStack.Navigator>
  )
}

const FavoritesStackNavigator = () => {
  return (
    <FavoritesStack.Navigator>
      <FavoritesStack.Screen name="FavoritesMain" component={FavoritesScreen} options={{ headerShown: false }} />
      <FavoritesStack.Screen name="FoodItemDetail" component={FoodItemDetail} options={{ headerShown: false }} />
    </FavoritesStack.Navigator>
  )
}

const MenuStackNavigator = ({ user, onSignOut }: { user: ExtendedUser | null; onSignOut: () => Promise<void> }) => {
  return (
    <MenuStack.Navigator screenOptions={{ headerShown: false }}>
      <MenuStack.Screen name="MenuMain">
        {() => <FrontScreen user={user} onSignOut={onSignOut} />}
      </MenuStack.Screen>
    </MenuStack.Navigator>
  )
}

// Keep your existing FloatingCartButton
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

// Updated MainTabNavigator with translations
const MainTabNavigator = ({ user, onSignOut }: { user: ExtendedUser | null; onSignOut: () => Promise<void> }) => {
  const { t } = useTranslation(); // Add this line

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
              iconName = "user"
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
        // Update tabBarLabel to use translations
        tabBarLabel: ({ focused, color }) => {
          let labelKey: string;
          switch (route.name) {
            case "Home":
              labelKey = "tabs.home";
              break;
            case "Favorites":
              labelKey = "tabs.favorites";
              break;
            case "Cart":
              labelKey = "tabs.cart";
              break;
            case "Orders":
              labelKey = "tabs.orders";
              break;
            case "Menu":
              labelKey = "tabs.menu";
              break;
            default:
              labelKey = "tabs.home";
              break;
          }
          return (
            <Text style={{ color, fontSize: 10, textAlign: 'center' }}>
              {t(labelKey)}
            </Text>
          );
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Favorites" component={FavoritesStackNavigator} />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarButton: (props) => <FloatingCartButton onPress={(e) => props.onPress?.(e)} />,
        }}
      />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Menu">
        {() => <MenuStackNavigator user={user} onSignOut={onSignOut} />}
      </Tab.Screen>
    </Tab.Navigator>
  )
}

// Bottom Tab Navigator
const Tab = createBottomTabNavigator<TabParamList>()

// Keep your existing AuthNavigator with translation for loading text
const AuthNavigator = () => {
  const [user, setUser] = useState<ExtendedUser | null>(null)
  const [initializing, setInitializing] = useState(true)
  const { t } = useTranslation(); // Add this line

  // Keep all your existing auth logic exactly as it is
  function onAuthStateChanged(firebaseUser: any) {
    console.log('Auth state changed:', firebaseUser ? 'User logged in' : 'User logged out')
    
    if (firebaseUser) {
      const userData: ExtendedUser = {
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || undefined,
        displayName: firebaseUser.displayName || null,
        email: firebaseUser.email || "",
        emailVerified: firebaseUser.emailVerified || false,
      }
      setUser(userData)
    } else {
      setUser(null)
    }

    if (initializing) setInitializing(false)
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber
  }, [initializing])

  const handleSignOut = async () => {
    try {
      await auth().signOut()
      setUser(null)
      Alert.alert(t('common.success'), t('auth.signedOutSuccess'))
    } catch (error: any) {
      console.error('Sign out error:', error)
      Alert.alert(t('common.error'), t('auth.signOutError') + ": " + error.message)
    }
  }

  const handleAuthSuccess = (firebaseUser: any) => {
    console.log('Auth success:', firebaseUser.email)
    const userData: ExtendedUser = {
      id: firebaseUser.uid,
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || undefined,
      displayName: firebaseUser.displayName || null,
      email: firebaseUser.email || "",
      emailVerified: firebaseUser.emailVerified || false,
    }
    setUser(userData)
  }

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F7931A" />
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    )
  }

  // Keep all your existing Stack.Navigator structure exactly as it is
  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName="MainTabs"
    >
      <Stack.Screen name="MainTabs">
        {() => <MainTabNavigator user={user} onSignOut={handleSignOut} />}
      </Stack.Screen>
      
      <Stack.Screen name="SignIn">
        {(props) => (
          <FirebaseAuthScreen
            {...props}
            onAuthSuccess={handleAuthSuccess}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="SignUp">
        {(props) => (
          <FirebaseSignUpScreen
            {...props}
            onAuthSuccess={handleAuthSuccess}
          />
        )}
      </Stack.Screen>
      
      <Stack.Screen name="AddressScreen" component={AddressScreen} />
      <Stack.Screen name="Profile">
        {(props) => <ProfileScreen {...props} user={user || undefined} />}
      </Stack.Screen>
      <Stack.Screen name="Address" component={AddressScreen} />
      <Stack.Screen name='LanguageSelectionScreen' component={LanguageSelectionScreen}/>
      <Stack.Screen name="Coupons">
        {(props) => <CouponsScreen {...props} user={user || undefined} />}
      </Stack.Screen>
      <Stack.Screen name="LoyaltyPoints">
        {(props) => <LoyaltyPointsScreen {...props} user={user ? {
          ...user,
          displayName: user.displayName || undefined
        } : undefined} />}
      </Stack.Screen>
      <Stack.Screen name="Wallet">
        {(props) => <WalletScreen {...props} user={user || undefined} />}
      </Stack.Screen>
      <Stack.Screen name="Refer" component={ReferScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="Refund" component={RefundScreen} />
      <Stack.Screen name="Cancellation" component={CancellationScreen} />
      <Stack.Screen name="FoodItemDetail" component={FoodItemDetail} />
    </Stack.Navigator>
  )
}

// Keep your existing MainApp
function MainApp() {
  return <AuthNavigator />
}

// Updated main App component with translation for loading text
export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [showLanguageScreen, setShowLanguageScreen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showOnboarding2, setShowOnboarding2] = useState(false)
  const [showLocationSelection, setShowLocationSelection] = useState(false)

  // Keep all your existing logic exactly as it is
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasSelectedLanguage = await AsyncStorage.getItem("selectedLanguage")
        const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding")
        const hasSelectedLocation = await AsyncStorage.getItem("locationConfirmed")

        if (!hasSelectedLanguage) {
          setShowLanguageScreen(true)
        } else if (!hasSeenOnboarding) {
          setShowOnboarding(true)
        } else if (!hasSelectedLocation) {
          setShowLocationSelection(true)
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
    setShowOnboarding(true)
  }

  const handleOnboardingFinish = async () => {
    setShowOnboarding(false)
    setShowOnboarding2(true)
  }

  const handleOnboardingFinish2 = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true")
    setShowOnboarding2(false)
    setShowLocationSelection(true)
  }

  const handleLocationSelectionFinish = async () => {
    await AsyncStorage.setItem("locationConfirmed", "true")
    setShowLocationSelection(false)
  }

  // Add LoadingComponent to use translations
  const LoadingComponent = () => {
    const { t } = useTranslation();
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F7931A" />
        <Text style={styles.loadingText}>{t('common.initializing')}</Text>
      </View>
    );
  };

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <UserProvider>
      <CartProvider>
        <OrderProvider>
          <NavigationContainer>
            {showLanguageScreen ? (
              <LanguageSelectionScreen onLanguageSelect={handleLanguageSelection} />
            ) : showOnboarding ? (
              <OnboardingScreen onFinish={handleOnboardingFinish} />
            ) : showOnboarding2 ? (
              <OnboardingScreen2 onFinish={handleOnboardingFinish2} />
            ) : showLocationSelection ? (
              <LocationSelectionScreen onFinish={handleLocationSelectionFinish} />
            ) : (
              <MainApp />
            )}
          </NavigationContainer>
        </OrderProvider>
      </CartProvider>
    </UserProvider>
  )
}

// Keep all your existing styles exactly as they are
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
})