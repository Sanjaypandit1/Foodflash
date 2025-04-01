import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import Headerbar from '../components/Headerbar';
import Categories from '../components/Categories';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import OfferSlider from '../components/OfferSlider';

const HomeScreen = () => {
  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor={'#FF3F00'} />

      <Headerbar />

      <GestureHandlerRootView style={{ flex: 1 }}>
     <OfferSlider /> 
      <Categories />
    </GestureHandlerRootView>
  
    
   

      <View>
        <Text>Foods</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: '100%',
    backgroundColor: '#F5F5F5',
  },
 
 
});

export default HomeScreen;
