import React, {useState, useEffect} from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import * as Location from 'expo-location'
import MapView from 'react-native-maps';
import { db, auth } from '../firebase';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/core'


const LocationTestScreen = ({route}) => {

  const navigation = useNavigation()
  const user = auth.currentUser;

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);


  async function saveCordinates() {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        latitude: latitude,
        longitude: longitude,
        timestamp: timestamp,
      });
    } catch(e) {

    }
    
  }

  useEffect(() => {
    (async () => {
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { coords, timestamp } = location;
        const { latitude, longitude } = coords;
        setLatitude(latitude);
        setLongitude(longitude);
        setTimestamp(timestamp);
      })();
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
      text = errorMsg;
    } else if (latitude && longitude && timestamp) {
      text = `Latitude: ${latitude}, Longitude: ${longitude}, Timestamp: ${timestamp}`;
    }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.back}>
        <TouchableOpacity onPress={() => navigation.navigate("BailOut")}>
          <Text>Go Back</Text>
        </TouchableOpacity>
        <Text>{text}</Text>
        <TouchableOpacity onPress={() => saveCordinates()}>
          <Text>Set my cordinates</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mapView}>
        <MapView style={styles.map} />
      </View>
      
    </SafeAreaView>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  back: {
    flex: 1
  },
  mapView: {
    flex: 5,
  },
  map: {
    width: '100%',
    height: '100%',
  },

})

export default LocationTestScreen;