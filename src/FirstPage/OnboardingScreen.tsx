import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

type OnboardingScreenProps = {
  onFinish: () => void;
};

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  return (
    <Swiper
      loop={false}
      dot={<View style={styles.dot} />}
      activeDot={<View style={styles.activeDot} />}
      paginationStyle={styles.paginationStyle}
    >
      <View style={styles.slide}>
        <Image
          source={require('../Assets/breakfast.jpg')} // Replace with actual image path
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Choose Yummy Food</Text>
          <Text style={styles.description}>
            Purchase your favorite food with addons and proceed to easy checkout.
          </Text>
        </View>
        <TouchableOpacity style={styles.skipButton} onPress={onFinish}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={onFinish}>
          <LinearGradient colors={['red', 'red']} style={styles.gradient}>
            <Icon name="arrow-forward" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Swiper>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: '#F8F4EF',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 60,
    paddingTop: 80,
  },
  image: {
    width: width * 0.85,
    height: height * 0.4,
    marginBottom: 30,
  },
  textContainer: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  skipButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  skipText: {
    fontSize: 16,
    color: '#888',
  },
  nextButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor:'red',
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: 'red',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 16,
    height: 8,
    backgroundColor: '#FF6600',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationStyle: {
    bottom: 100,
  },
});

export default OnboardingScreen;
