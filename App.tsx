import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { GestureResponderEvent } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



// Importing Screens
import HomeScreen from './src/screens/HomeScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import CartScreen from './src/screens/CartScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import MenuScreen from './src/screens/MenuScreen';
import LanguageSelectionScreen from './src/FirstPage/Language';
import OnboardingScreen from './src/FirstPage/OnboardingScreen';
import OnboardingScreen2 from './src/FirstPage/onboardingscreen2';
import ProductScreen from './src/subscreen/ProductScreen';

// Type for bottom tab navigator
type TabParamList = {
  Home: undefined;
  Favorites: undefined;
  Cart: undefined;
  Orders: undefined;
  Menu: undefined;
  
};

const Stack = createNativeStackNavigator();

// Bottom Tab Navigator
const Tab = createBottomTabNavigator<TabParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Homescreen" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen 
        name="ProductScreen" 
        component={ProductScreen as React.ComponentType<any>} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
};


// Navicons configuration
const tabBarIcon = (route: keyof TabParamList) => ({ color, size }: { color: string; size: number }) => {
  let iconName: string;
  switch (route) {
    case 'Home':
      iconName = 'home';
      break;
    case 'Favorites':
      iconName = 'heart';
      break;
    case 'Cart':
      iconName = 'shopping-cart';
      break;
    case 'Orders':
      iconName = 'shopping-bag';
      break;
    case 'Menu':
      iconName = 'bars';
      break;
    default:
      iconName = 'circle';
      break;
  }
  return <Icon name={iconName} size={size} color={color} />;
};

// Floating Cart Button Component
const FloatingCartButton = ({ onPress }: { onPress?: (event: GestureResponderEvent) => void }) => (
  <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
    <Icon name="shopping-cart" size={28} color="white" />
  </TouchableOpacity>
);

// Main App Component
// Main App Component
function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: tabBarIcon(route.name as keyof TabParamList),
        tabBarActiveTintColor: '#F7931A',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: styles.tabBarStyle,
        tabBarLabel: () => null,
        headerShown: false, // Hide the top header
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />

      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarButton: (props) => (
            <FloatingCartButton onPress={(e) => props.onPress?.(e)} />
          ),
        }}
      />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Menu" component={MenuScreen} />
    </Tab.Navigator>
  );
}


// Wrapper App Component
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showLanguageScreen, setShowLanguageScreen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showOnboarding2, setShowOnboarding2] = useState(false);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasSelectedLanguage = await AsyncStorage.getItem('selectedLanguage');
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');

        if (!hasSelectedLanguage) {
          setShowLanguageScreen(true);
        } else if (!hasSeenOnboarding) {
          // Initially, show the first onboarding screen
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error('Error reading AsyncStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFirstLaunch();
  }, []);

  const handleLanguageSelection = async () => {
    await AsyncStorage.setItem('selectedLanguage', 'true');
    setShowLanguageScreen(false);
    setShowOnboarding(true); // Show onboarding after selecting language
  };

  // Handler for finishing OnboardingScreen1:
  const handleOnboardingFinish = async () => {
    // Option 1: If you want two separate onboarding flows, update state:
    setShowOnboarding(false);
    setShowOnboarding2(true);
    // Option 2: If you want to finish onboarding completely:
    // await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    // setShowOnboarding(false);
  };

  // Handler for finishing OnboardingScreen2:
  const handleOnboardingFinish2 = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding2(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F7931A" />
      </View>
    );
  }

  return (
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
  );
}

// Styles
const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: 'white',
    height: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
  },
  floatingButton: {
    top: -25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F7931A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
