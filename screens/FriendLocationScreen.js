import React, {useEffect, useState} from 'react'
import {View, SafeAreaView, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import { auth, db } from '../firebase';
import { useNavigation } from '@react-navigation/core'
import MapView, {Marker} from 'react-native-maps';
import {doc, getDoc} from 'firebase/firestore'

const FriendLocationScreen = ({route}) => {

    const uid = route.params.paramKey
    const user = auth.currentUser;
    const navigation = useNavigation()

    const [targetLatitude, setTargetLatitude] = useState(0)
    const [targetLongitude, setTargetLongitude] = useState(0)
    const [userLatitude, setUserLatitude] = useState(0)
    const [userLongitude, setUserLongitude] = useState(0)
 
    useEffect(() => {
        const docRef = doc(db, 'users', uid)
        getDoc(docRef)
            .then((doc) => {
                setTargetLatitude(doc.data().latitude)
                setTargetLongitude(doc.data().longitude)
            })

        const docRefUser = doc(db, 'users', user.uid)
        getDoc(docRefUser)
            .then((doc) => {
                setUserLatitude(doc.data().latitude)
                setUserLongitude(doc.data().longitude)
            })
    }, []);


    //35.62934621250617, -80.8981239268621

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.backButtonView}> 
                <TouchableOpacity
                    onPress={() => navigation.navigate('FriendsProfile', {paramKey: uid})}
                >
                    <Image
                        source={require('../assets/back_button.png')}
                        style={styles.backLogo}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.secondaryInfoView}>
                <MapView 
                    initialRegion={{
                        latitude: targetLatitude,
                        longitude: targetLongitude,
                        latitudeDelta: 20.0922,
                        longitudeDelta: 20.0421,
                    }}
                    style={styles.map}
                > 
                    <Marker 
                        coordinate={{latitude: targetLatitude, longitude: targetLongitude}}
                        title={"Target"}
                        description={"My desc"}
                    />
                    <Marker 
                        coordinate={{latitude: userLatitude, longitude: userLongitude}}
                        title={"Current Loc"}
                        description={"Other desc"}
                    />

                </MapView>
                
            </View>
            <View style={styles.thirdView}>
                <Text>{targetLatitude}</Text>
                <Text>{targetLongitude}</Text>
                <Text>{userLatitude}</Text>
                <Text>{userLongitude}</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,  
    },
    backButtonView: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        backgroundColor: 'gray'
    },
    secondaryInfoView: {
        flex: 20,
    },
    thirdView: {
        flex: 2
    },
    backLogo: {
        height: 20,
        width: 32,
        marginLeft: '14%'
    },   
    map: {
        width: '100%',
        height: '100%',
      },
})

export default FriendLocationScreen