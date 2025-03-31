import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Headerbar = () => {
  return (
    <View style={styles.container}>
      {/* Location Section */}
      <TouchableOpacity style={styles.location}>
        <Ionicons name="location-outline" size={24} color="black" style={{ marginRight: 6 }} />
        <View>
          <Text style={styles.locationTitle}>Location</Text>
          <Text style={styles.locationText}>Nepal</Text>
        </View>
      </TouchableOpacity>

      {/* Search Box */}
      <TouchableOpacity style={styles.searchbox}>
        <AntDesign name="search1" size={24} color="#FF3F00" style={styles.searchicon} />
        <Text style={styles.input}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Headerbar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column', // Stack items vertically
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 10, // Ensures the searchbox is at the bottom
    backgroundColor: '#F7931A',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: 'grey',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10, // Spacing between location & searchbox
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'black',
  },
  locationText: {
    fontSize: 14,
    color: 'black',
  },
  searchbox: {
    flexDirection: 'row',
    width: '100%', // Full width
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    elevation: 2,
  },
  searchicon: {
    marginRight: 10,
  },
  input: {
    fontSize: 16,
    color: '#c4c4c4',
  },
});
