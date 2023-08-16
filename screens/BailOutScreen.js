import React, { useState, useEffect, useRef } from 'react'
import { View, TouchableOpacity, StyleSheet, Image, Text, AppState} from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { auth, db } from '../firebase';
import {collection, query, where, onSnapshot, doc, getDoc, updateDoc} from 'firebase/firestore'
import FriendsListScreen from './FriendsListScreen';
import * as Location from 'expo-location'


const BailOutScreen = () => {
    const navigation = useNavigation()
    const user = auth.currentUser;


    const [webFriends, setWebFriends] = useState([])

    const loadWeb = async() => {
        const q = query(collection(db, "users", user.uid, 'friends'), where('isFriend', '==', 'mutual'));
        onSnapshot(q, (querySnapshot) => {
            // create an array of all of your friends
            const friendArray = []
            querySnapshot.forEach((doc) => {
                friendArray.push({
                    key: doc.id,
                    imageURl: doc.data().imageURl,
                    starred: doc.data().starStatus
                })
            });
            // make a new array for the web
            const webArray = []
            // add only starred friends to the new array
            friendArray.forEach((friend) => {
                if (friend.starred) {
                    webArray.push(friend)
                }
            })
            // finish filling the array with non-starred friends
            friendArray.forEach((friend) => {
                if (!friend.starred) {
                    webArray.push(friend)
                }
            })
            // truncate the array to 6 friends
            setWebFriends(webArray.slice(0, 6));
        })
    }

    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [timestamp, setTimestamp] = useState('')
    useEffect(() => {
        fetchLocation(); // Fetch initial location immediately
        loadWeb()
      
        const interval = setInterval(() => {
            fetchLocation();
          }, 60000);
        return () => clearInterval(interval);
      }, []);



    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
            if (doc.data().locationQuery === true) {
                updateLocation();
            }
        });
    
        return () => {
            unsubscribe();
        };
    }, [updateLocation]);

    const fetchLocation = async () => {
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
        console.log(latitude);
      };

    const updateLocation = async() => {
        await updateDoc(doc(db, "users", user.uid), {
            latitude: latitude,
            longitude: longitude,
            timestamp: timestamp,
        })
    }
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    useEffect(() => {
        const subscription = AppState.addEventListener("change", nextAppState => {
        if (
            appState.current.match(/inactive|background/) &&
            nextAppState === "active"
        ) {
            console.log("App has come to the foreground!");
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        console.log("AppState", appState.current);
        });

        return () => {
        subscription.remove();
        };
    }, []);
    
    return (
        <View style={styles.container}> 
            <View style={styles.navigateView}>
                <TouchableOpacity 
                    onPress={() => navigation.jumpTo("AddFriends")}
                >
                    <Image
                        source={require('../assets/purple_add.png')}
                        style={styles.logosAdd}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.jumpTo("LocalProfile")}>
                    <Image
                        source={require('../assets/purple_person.png')}
                        style={styles.logoProfile}
                    />
                </TouchableOpacity>
                
            </View>

            <View style={styles.spiderView}>
                {webFriends.map((_, index) => (
                    <View
                        key={index}
                        style={[
                        styles.line,
                        {
                            transform: [{ rotate: `${index * 60}deg` }],
                        },
                        ]}
                    >
                    {webFriends[index] ? 
                    <View
                        style={[styles.circleEnd,]}
                    >
                        <TouchableOpacity 
                            style={styles.circleEnd}
                            onPress={() => navigation.navigate('FriendsProfile', {paramKey: webFriends[index].key})}
                        >
                        <Image
                            source={{uri: webFriends[index].imageURl}}
                            // change  border width if friend is starred
                            style={[styles.circleEnd, {borderWidth: webFriends[index].starred ? 3 : 1}]}
                        /> 
                    </TouchableOpacity>
                    </View>
                     : null }
                    </View>
                ))}
                <TouchableOpacity style={styles.circle}>
                            <Image
                                    source={require('../assets/bailout-logo.png')}
                                    style={styles.bailoutLogo}
                            />
                </TouchableOpacity>
            </View>

            <View style={styles.listView}>
                <Text>Current state is: {appStateVisible}</Text>
            </View>

            <View style={styles.slideView}>
                
            </View>
            <FriendsListScreen/>
     
        </View>
    ) 
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    navigateView: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginHorizontal: '13%',
    },
    spiderView: {
        flex: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listView: {
        flex: 3,
        borderTopColor: 'black',
        borderBottomColor: 'black',
        borderTopWidth: 2,
        borderBottomWidth: 2,
    },
    slideView: {
        flex: 2,
    },
    logosAdd: {
        height: 25,
        width: 30,
    },
    logoProfile: {
        height: 26,
        width: 26,
    },
    bailoutLogo: {
        width: '90%',
        height: '70%',
        top: '17.5%',
        left: '5%'
    },
    circle: {
        width: '30%',
        height: '19%',
        borderRadius: 100,
        backgroundColor: '#efefef',
        borderWidth: 3,
        borderColor: '#CF9FFF',
        position: 'absolute',
      },
      line: {
        position: 'absolute',
        top: '30%',
        left: '50%',
        width: 3,
        height: '42.5%',
        backgroundColor: '#CF9FFF',
        alignItems: 'center',
      },
      circleEnd: {
        width: 70,
        height: 70,
        borderRadius: 70,
        borderColor: '#CF9FFF',
        position: 'absolute',
        bottom: '-17%',
        zIndex: 1,
      }
})

export default BailOutScreen