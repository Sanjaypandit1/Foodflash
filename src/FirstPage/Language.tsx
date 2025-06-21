import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

// Language Data
const languages = [
  { id: 'en', name: 'English', flag: '🇺🇸' },
  { id: 'ne', name: 'नेपाली', flag: '🇳🇵' },
];

type LanguageScreenProps = {
  onLanguageSelect?: () => void;
};

const LanguageSelectionScreen = ({ onLanguageSelect }: LanguageScreenProps) => {
  const [selectedLang, setSelectedLang] = useState('en');
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  const handleLanguageSelection = async () => {
    try {
      // Change the app language immediately
      await i18n.changeLanguage(selectedLang);
      
      // Save the actual language code for i18n system
      await AsyncStorage.setItem('currentAppLanguage', selectedLang);
      
      // Save the flag that language has been selected for app flow
      await AsyncStorage.setItem('selectedLanguage', 'true');

      if (onLanguageSelect) {
        onLanguageSelect();
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../Assets/flag.jpg')} style={styles.image} resizeMode="contain" />
      
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{t('language.title')}</Text>
        <Text style={styles.subtitle}>{t('language.subtitle')}</Text>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={languages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.languageItem,
                selectedLang === item.id && styles.selectedLanguage,
              ]}
              onPress={() => setSelectedLang(item.id)}
              activeOpacity={0.8}
            >
              <View style={styles.flagContainer}>
                <Text style={styles.flag}>{item.flag}</Text>
              </View>
              <Text style={[
                styles.languageText,
                selectedLang === item.id && styles.selectedLanguageText
              ]}>
                {item.name}
              </Text>
              {selectedLang === item.id && (
                <View style={styles.checkmarkContainer}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <TouchableOpacity 
        style={styles.nextButton} 
        onPress={handleLanguageSelection}
        activeOpacity={0.9}
      >
        <Text style={styles.nextText}>{t('common.next')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 50,
  },
  image: {
    width: '100%',
    height: 140,
    alignSelf: 'center',
    marginBottom: 20,
  },
  headerContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    color: '#DC2626', // Red
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6B7280', // Gray
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  listContainer: {
    flex: 1,
    marginBottom: 20,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedLanguage: {
    backgroundColor: '#FFF7ED', // Light orange background
    borderColor: '#FB923C', // Orange border
    shadowColor: '#FB923C',
    shadowOpacity: 0.15,
    transform: [{ scale: 1.02 }],
  },
  flagContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  flag: {
    fontSize: 24,
  },
  languageText: {
    fontSize: 18,
    flex: 1,
    fontWeight: '500',
    color: '#374151',
  },
  selectedLanguageText: {
    color: '#DC2626', // Red text when selected
    fontWeight: '600',
  },
  checkmarkContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DC2626', // Red background
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#DC2626', // Red background
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#DC2626',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default LanguageSelectionScreen;