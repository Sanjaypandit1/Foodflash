// Updated src/FirstPage/Language.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

// Language Data
const languages = [
  { id: 'en', name: 'English', flag: '🇺🇸' },
  { id: 'ne', name: 'नेपाली', flag: '🇳🇵' },
  { id: 'ar', name: 'عربي', flag: '🇸🇩' },
  { id: 'es', name: 'Español', flag: '🇪🇸' },
  { id: 'bn', name: 'বাংলা', flag: '🇧🇩' },
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
      <Text style={styles.title}>{t('language.title')}</Text>
      <Text style={styles.subtitle}>{t('language.subtitle')}</Text>

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
          >
            <Text style={styles.flag}>{item.flag}</Text>
            <Text style={styles.languageText}>{item.name}</Text>
            {selectedLang === item.id && <Text style={styles.checkmark}>✔️</Text>}
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.nextButton} onPress={handleLanguageSelection}>
        <Text style={styles.nextText}>{t('common.next')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LanguageSelectionScreen;

// Keep your existing styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  image: {
    width: '100%',
    height: 150,
    alignSelf: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: 'gray',
    marginBottom: 20,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#F5F5F5',
  },
  selectedLanguage: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#F7931A',
  },
  flag: {
    fontSize: 24,
    marginRight: 10,
  },
  languageText: {
    fontSize: 16,
    flex: 1,
  },
  checkmark: {
    fontSize: 18,
    color: '#F7931A',
  },
  nextButton: {
    backgroundColor: 'red',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  nextText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});