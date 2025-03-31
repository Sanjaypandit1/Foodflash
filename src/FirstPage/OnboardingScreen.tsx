import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

// Define Props
type OnboardingScreenProps = {
  onFinish: () => void;
};

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  return (
    <Swiper
      loop={false}
      dot={<View style={styles.dot} />}
      activeDot={<View style={styles.activeDot} />}
    >
      {/* First Screen */}
      <View style={styles.slide}>
        <Image
          source={require('../Assets/breakfast.jpg')} // Replace with actual path
          style={styles.image}
        />
        <Text style={styles.title}>Choose Yummy Food</Text>
        <Text style={styles.description}>
          Purchase your favorite food with addons and proceed to easy checkout.
        </Text>
        <TouchableOpacity style={styles.skipButton} onPress={onFinish}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={onFinish}>
          <LinearGradient colors={['#FF8C00', '#FF6600']} style={styles.gradient}>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F4EF',
    paddingHorizontal: 20,
  },
  image: {
    width: width * 1,
    height: height * 0.4,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  skipText: {
    fontSize: 16,
    color: '#888',
  },
  nextButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
    marginHorizontal: 5,
  },
  activeDot: {
    width: 16,
    height: 8,
    backgroundColor: '#FF6600',
    borderRadius: 4,
    marginHorizontal: 5,
  },
});

export default OnboardingScreen;
