import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// Language Data
const languages = [
  { id: 'en', name: 'English', flag: '🇺🇸' },
  { id: 'ne', name: 'Nepali', flag: '🇳🇵' },
  { id: 'ar', name: 'عربي', flag: '🇸🇩' },
  { id: 'es', name: 'Spanish', flag: '🇪🇸' },
  { id: 'bn', name: 'Bengali', flag: '🇧🇩' },
];

// ✅ Props type define गरियो
type LanguageScreenProps = {
  onLanguageSelect?: () => void;
};

const LanguageSelectionScreen = ({ onLanguageSelect }: LanguageScreenProps) => {
  const [selectedLang, setSelectedLang] = useState('en');
  const navigation = useNavigation();

  const handleLanguageSelection = async () => {
    await AsyncStorage.setItem('selectedLanguage', selectedLang);

    if (onLanguageSelect) {
      onLanguageSelect();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../Assets/flag.jpg')} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>Choose Your Language</Text>
      <Text style={styles.subtitle}>Choose your language to proceed</Text>

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
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LanguageSelectionScreen;

// Styles
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
    marginTop: 10, // Moved up slightly
    marginBottom: 30, // Added spacing from bottom
  },
  nextText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
