import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';

const Categories = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.head}>What's on Your Mind</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
        <TouchableOpacity style={styles.box}>
          <Image source={require('../Assets/pizza/chickenpizza.jpg')} style={styles.image} />
          <Text style={styles.label}>Pizza</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.box}>
          <Image source={require('../Assets/momo/chickenmomo.jpeg')} style={styles.image} />
          <Text style={styles.label}>Momo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.box}>
          <Image source={require('../Assets/Chowmin/vegchowmin.webp')} style={styles.image} />
          <Text style={styles.label}>Chowmin</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.box}>
          <Image source={require('../Assets/Burger/vegburger.jpg')} style={styles.image} />
          <Text style={styles.label}>Burger</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.box}>
          <Image source={require('../Assets/biryani/chickenbiryani.jpeg')} style={styles.image} />
          <Text style={styles.label}>Biryani</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  container: {
    width: 'auto',
    paddingVertical: 15,
    backgroundColor: '#fff', // Clean white background
  },
  head: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    padding:10,
    marginBottom: 10,
  },
  scrollView: {
    paddingHorizontal: 10,
  },
  box: {
    backgroundColor: '#F7931A',
    padding: 12,
    marginHorizontal: 8,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: 120, // Ensures uniform size
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 2, height: 4 },
    elevation: 5, // Android shadow
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
