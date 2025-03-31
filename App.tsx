import * as React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { GestureResponderEvent } from 'react-native';


// Importing Screens
import HomeScreen from './src/screens/HomeScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import CartScreen from './src/screens/CartScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import MenuScreen from './src/screens/MenuScreen';

// Type for bottom tab navigator
type TabParamList = {
  Home: undefined;
  Favorites: undefined;
  Cart: undefined;
  Orders: undefined;
  Menu: undefined;
};

// Bottom Tab Navigator
const Tab = createBottomTabNavigator<TabParamList>();

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



// App component
function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: tabBarIcon(route.name as keyof TabParamList),
          tabBarActiveTintColor: '#F7931A', // Active orange color
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: styles.tabBarStyle,
          tabBarLabel: () => null, // Hide labels
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
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
});

export default App;
