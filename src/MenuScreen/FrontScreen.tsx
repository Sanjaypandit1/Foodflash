import React, { useState } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationProp, useNavigation } from '@react-navigation/native';


// Get screen dimensions for responsive layout
const {  } = Dimensions.get('window');

// Define types for menu items
interface MenuItem {
  id: number;
  title: string;
  icon: string;
  iconType?: 'feather' | 'material';
  toggle?: boolean;
  onPress?: () => void;
}

// Menu Item Component Props
interface MenuItemProps {
  title: string;
  icon: string;
  iconType?: 'feather' | 'material';
  toggle?: boolean;
  isLast?: boolean;
  onPress?: () => void; // 👉 यो लाइन थप्नुहोस्
}

// Menu Section Component Props
interface MenuSectionProps {
  title: string;
  items: MenuItem[];
}

// Navigation type
type RootStackParamList = {
  Settings: undefined;
  SignIn: undefined;
  LanguageSelectionScreen: undefined;
};

type NavigationProps = NavigationProp<RootStackParamList, 'Settings'>;

// Menu Item Component
const MenuItem: React.FC<MenuItemProps> = ({ title, icon, iconType = 'feather', toggle, isLast, onPress }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <TouchableOpacity
    style={[styles.menuItem, isLast ? styles.lastMenuItem : null]}
    onPress={onPress}
    >
      <View style={styles.menuItemLeft}>
        {iconType === 'feather' ? (
          <Icon name={icon} size={20} color="#000" style={styles.menuIcon} />
        ) : (
          <MaterialIcon name={icon} size={20} color="#000" style={styles.menuIcon} />
        )}
        <Text style={styles.menuText}>{title}</Text>
      </View>
      {toggle && (
        <Switch
          trackColor={{ false: '#f4f3f4', true: '#FFC8A2' }}
          thumbColor={isEnabled ? '#FF8C00' : '#f4f3f4'}
          ios_backgroundColor="#f4f3f4"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      )}
    </TouchableOpacity>
  );
};

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
  );
};

// Profile Header Component
const ProfileHeader: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image source={require('../Assets/logo.jpg')} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Guest User</Text>
            <Text style={styles.profileSubtitle}>Login to view all the features</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Sign In Button Component
const SignInButton: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <TouchableOpacity
      style={styles.signInButton}
      onPress={() => navigation.navigate('SignIn')}
    >
      <Icon name="power" size={20} color="#fff" />
      <Text style={styles.signInText}>Sign In</Text>
    </TouchableOpacity>
  );
};

// Settings Screen
const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  // Define menu items
  const generalItems: MenuItem[] = [
    { id: 1, title: 'Profile', icon: 'user' },
    { id: 2, title: 'My Address', icon: 'map-pin' },
    { id: 3, title: 'Language', icon: 'globe' , onPress: () => navigation.navigate('LanguageSelectionScreen' as never)},
    { id: 4, title: 'Dark Mode', icon: 'moon', toggle: true },
  ];

  const promotionalItems: MenuItem[] = [
    { id: 1, title: 'Coupon', icon: 'ticket', iconType: 'material' },
    { id: 2, title: 'Loyalty Points', icon: 'star' },
    { id: 3, title: 'My Wallet', icon: 'credit-card' },
  ];

  const earningItems: MenuItem[] = [
    { id: 1, title: 'Refer & Earn', icon: 'users' },
  ];

  const helpSupportItems: MenuItem[] = [
    { id: 1, title: 'Help & Support', icon: 'headphones', iconType: 'feather' },
    { id: 2, title: 'About Us', icon: 'info', iconType: 'feather' },
    { id: 3, title: 'Terms & Condition', icon: 'file-text', iconType: 'feather' },
    { id: 4, title: 'Privacy Policy', icon: 'shield', iconType: 'feather' },
    { id: 5, title: 'Refund Policy', icon: 'refresh-cw', iconType: 'feather' },
    { id: 6, title: 'Cancellation Policy', icon: 'x-circle', iconType: 'feather' },
  ];

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
        <SignInButton />
        {/* Add extra space at the bottom to ensure content isn't hidden behind tab navigation */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5EB',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 80, // Add padding to ensure content isn't hidden behind tab navigation
  },
  header: {
    backgroundColor: 'red', // Changed from red to match the theme
    paddingTop: 35,
    paddingBottom: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
  },
  profileInfo: {
    marginLeft: 15,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#fff',
  },
  menuSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: 'red', // Changed from red to match the theme
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 15,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red', // Changed from red to match the theme
    borderRadius: 25,
    paddingVertical: 12,
    marginHorizontal: 100,
    marginTop: 20,
    marginBottom: 20,
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  bottomSpacer: {
    height: 20, // Additional space at the bottom
  },
});

export default SettingsScreen;
