import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Headerbar = () => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {/* Location Section */}
        <TouchableOpacity style={styles.location}>
          <Ionicons name="location-outline" size={24} color="white" style={{ marginRight: 6 }} />
          <View>
            <Text style={styles.locationTitle}>Location</Text>
            <Text style={styles.locationText}>Nepal</Text>
          </View>
        </TouchableOpacity>
        
        {/* Notification Bell Icon */}
        <TouchableOpacity style={styles.bellIcon}>
          <Ionicons name="notifications-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Search Box */}
      <TouchableOpacity style={styles.searchbox}>
        <AntDesign name="search1" size={30} color="#FF3F00" style={styles.searchicon} />
        <Text style={styles.input}>Are you hungry !!</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Headerbar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#F7931A',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: 'grey',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  locationText: {
    fontSize: 14,
    color: 'white',
  },
  bellIcon: {
    padding: 5,
   backgroundColor:'white',
   borderRadius:10,
  },
  searchbox: {
    flexDirection: 'row',
    width: '100%',
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
    color: '#F7931A',
  },
});