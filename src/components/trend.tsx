import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import React from 'react';
import { NavigationProp } from '@react-navigation/native';

// Define prop types
type Props = {
    navigation: NavigationProp<any>; // 'any' can be replaced with your stack param list if available
  };
  

const TodayTrends: React.FC<Props> = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <Text style={styles.head}>Today's Trends</Text>
      <Text style={styles.subhead}>Here's what you might like to taste</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
        <TouchableOpacity style={styles.card} onPress = {() =>navigation.navigate('ProductScreen')}>
          <Image source={require('../Assets/biryani/chickenbiryani.jpeg')} style={styles.image} />
          <View style={styles.discountTag}><Text style={styles.discountText}>10.0% OFF</Text></View>
          <Text style={styles.restaurant}>Swad Restaurant</Text>
          <Text style={styles.itemName}>Chicken Biryani</Text>
          <Text style={styles.price}><Text style={styles.strikeThrough}>Rs.500</Text> Rs.450</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.card} onPress = {() =>navigation.navigate('ProductScreen2')} >
          <Image source={require('../Assets/momo/chickenmomo.jpeg')} style={styles.image} />
          <View style={styles.discountTag}><Text style={styles.discountText}>30.0% OFF</Text></View>
          <Text style={styles.restaurant}>Hotel Planet</Text>
          <Text style={styles.itemName}>Chicken Momo</Text>
          <Text style={styles.price}><Text style={styles.strikeThrough}>Rs.200</Text> Rs. 140</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress = {() =>navigation.navigate('ProductScreen3')}>
          <Image source={require('../Assets/Chowmin/chickenchowmin.jpg')} style={styles.image} />
          <View style={styles.discountTag}><Text style={styles.discountText}>10.0% OFF</Text></View>
          <Text style={styles.restaurant}>Hotel Swad</Text>
          <Text style={styles.itemName}>Chicken Chowmin</Text>
          <Text style={styles.price}><Text style={styles.strikeThrough}>Rs.200</Text> Rs. 180</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}onPress = {() =>navigation.navigate('Samosa')}>
          <Image source={require('../Assets/Extra/samosa.jpg')} style={styles.image} />
          <View style={styles.discountTag}><Text style={styles.discountText}>10.0% OFF</Text></View>
          <Text style={styles.restaurant}>Parnam Cafe</Text>
          <Text style={styles.itemName}>Samosa Chat</Text>
          <Text style={styles.price}><Text style={styles.strikeThrough}>Rs.110</Text> Rs. 100</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress = {() =>navigation.navigate('Pakoda')}>
          <Image source={require('../Assets/Extra/vegpakoda.jpg')} style={styles.image} />
          <View style={styles.discountTag}><Text style={styles.discountText}>40.0% OFF</Text></View>
          <Text style={styles.restaurant}>Parnam Cafe</Text>
          <Text style={styles.itemName}>Pakoda</Text>
          <Text style={styles.price}><Text style={styles.strikeThrough}>Rs.100</Text> Rs. 60</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default TodayTrends;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9F1E7',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  head: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E96A1C',
    marginBottom: 5,
  },
  subhead: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  scrollView: {
    flexDirection: 'row',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
    width: 170,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 2, height: 2 },
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  discountTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#E96A1C',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  restaurant: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E96A1C',
  },
  strikeThrough: {
    textDecorationLine: 'line-through',
    color: '#888',
    marginRight: 5,
  },
});