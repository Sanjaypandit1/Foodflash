import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import Swiper from 'react-native-swiper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const OfferSlider = () => {
  return (
    <View style={styles.container}>
      <Swiper
        autoplay={true}
        autoplayTimeout={5}
        showsButtons={true}
        dotColor="red"
        activeDotColor="black"
        nextButton={<MaterialIcons name="arrow-forward-ios" size={30} color="black" />}
        prevButton={<MaterialIcons name="arrow-back-ios" size={30} color="black" />}
      >
        <View style={styles.slide}>
          <Image source={require('../Assets/poster/poster1.jpg')} style={styles.image} />
        </View>
        <View style={styles.slide}>
          <Image source={require('../Assets/poster/poster2.jpg')} style={styles.image} />
        </View>
        <View style={styles.slide}>
          <Image source={require('../Assets/poster/poster7.jpg')} style={styles.image} />
        </View>
        <View style={styles.slide}>
          <Image source={require('../Assets/poster/poster4.jpg')} style={styles.image} />
        </View>
        <View style={styles.slide}>
          <Image source={require('../Assets/poster/poster5.jpg')} style={styles.image} />
        </View>
        <View style={styles.slide}>
          <Image source={require('../Assets/poster/poster6.jpeg')} style={styles.image} />
        </View>
      </Swiper>
    </View>
  );
};

export default OfferSlider;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 150,
   // backgroundColor: 'red',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  slide:{
    width:'100%',
    height:'100%',
    justifyContent:'center',
    alignContent:'center',
  }
});
