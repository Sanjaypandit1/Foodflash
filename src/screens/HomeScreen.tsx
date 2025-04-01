import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import Headerbar from '../components/Headerbar';
import Categories from '../components/Categories';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import OfferSlider from '../components/OfferSlider';
import TodayTrends from '../components/trend';

const HomeScreen = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView 
        style={styles.mainContainer} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 80 }} // Added padding at the bottom
      >
        <StatusBar backgroundColor={'#FF3F00'} />
        <Headerbar />
        <OfferSlider />
        <Categories />
        <TodayTrends />
        
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});

export default HomeScreen;
