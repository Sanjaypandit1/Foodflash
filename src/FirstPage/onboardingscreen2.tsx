import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get("window");

const onboardingData = [
  {
    id: 1,
    image: require("../Assets/deliveryboy.webp"), // Replace with actual image path
    title: "Enjoy On-Time Food Delivery!",
    description: "Get the food delivered to your doorstep at the preferred time and schedule.",
  },
  // You can add more slides if needed
];

interface OnboardingScreen2Props {
  navigation?: any;
  onFinish: () => void;
}

const OnboardingScreen2: React.FC<OnboardingScreen2Props> = ({ navigation, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish();
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={onboardingData[currentIndex].image}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{onboardingData[currentIndex].title}</Text>
        <Text style={styles.description}>{onboardingData[currentIndex].description}</Text>
      </View>
      <View style={styles.pagination}>
        {onboardingData.map((_, index) => (
          <View key={index} style={[styles.dot, currentIndex === index && styles.activeDot]} />
        ))}
      </View>
        <TouchableOpacity style={styles.nextButton} onPress={onFinish}>
              <LinearGradient colors={['#FF8C00', '#FF6600']} style={styles.gradient}>
                <Icon name="arrow-forward" size={24} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF6F1",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 40,
  },
  image: {
    width: width * 0.85,
    height: height * 0.4,
    marginBottom: 20,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    width: 16,
    height: 8,
    backgroundColor: "",
    borderRadius: 4,
    marginHorizontal: 4,
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
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationStyle: {
    bottom: 100,
  },
});

export default OnboardingScreen2;
