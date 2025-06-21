import React from 'react';
import { StyleSheet, StatusBar, Platform } from 'react-native';
import Headerbar from '../components/Headerbar';
import Categories from '../components/Categories';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import OfferSlider from '../components/OfferSlider';
import TodayTrends from '../components/trend';
import HighlightsForYou from '../components/HighLights';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Resturant from '../components/Resturant';

// Define stack param list (adjust based on your app structure)
type RootStackParamList = {
  Home: undefined;
  ProductScreen: undefined; // Add other screens if needed
};

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        style={styles.mainContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }} // Added padding at the bottom
      >
        <StatusBar backgroundColor={'#FFF5EB'} />
        <Headerbar />
        <OfferSlider />
        <Categories navigation={navigation}/>
        <TodayTrends navigation={navigation} />
        <HighlightsForYou />
        <Resturant />
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF5EB',
  },
  safeArea: {
    flex: 1,
  },
});

export default HomeScreen;