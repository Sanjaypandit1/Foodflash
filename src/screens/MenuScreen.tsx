import { StyleSheet, StatusBar, Platform, ScrollView} from 'react-native';
import React from 'react';
import SettingsScreen from '../MenuScreen/FrontScreen';

const MenuScreen = () => {
  return <>
    <ScrollView style={styles.container}>
   <SettingsScreen />
   </ScrollView>
   </>
};

export default MenuScreen;

const styles = StyleSheet.create({
  container:{
    width: 'auto',
    
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
  },
  safeArea: {
    flex: 1,
  },
});
