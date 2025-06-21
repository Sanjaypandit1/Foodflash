// i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translation files
import en from './locals/en.json';
import ne from './locals/ne.json';



const LANGUAGE_DETECTOR = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      // Use different key for i18n language storage
      const savedLanguage = await AsyncStorage.getItem('currentAppLanguage');
      if (savedLanguage) {
        callback(savedLanguage);
        return;
      }
      callback('en');
    } catch (error) {
      console.log('Error reading language', error);
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      // Use different key for i18n language storage
      await AsyncStorage.setItem('currentAppLanguage', language);
    } catch (error) {
      console.log('Error saving language', error);
    }
  },
};

i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    fallbackLng: 'en',
    debug: false,
    resources: {
      en: { translation: en },
      ne: { translation: ne },

  
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;