import React, {useState, useEffect} from 'react'
import {Text, StyleSheet, View, TouchableOpacity, Image} from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { auth, db } from '../firebase';
import {doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'

const FriendsProfileScreen = ({route}) => {

    const navigation = useNavigation()
    const uid = route.params.paramKey
    const user = auth.currentUser;

    const [fullName, setFullName] = useState('')
    const [username, setUserName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [eyeColor, setEyeColor] = useState('')
    const [hairColor, setHairColor] = useState('')
    const [height, setHeight] = useState('')
    const [identifyingFeatures, setIdentifyingFeatures] = useState('')
    const [emergencyName, setEmergencyName] = useState('')
    const [emergencyNumber, setEmergencyNumber] = useState('')
    const [image, setImage] = useState(null);
    const [star, setStar] = useState()
    

    useEffect(() => {
        getStarStatus()

        const docRef = doc(db, 'users', uid)
        getDoc(docRef)
        .then((doc) => {
            setFullName(doc.data().fullName)
            setUserName(doc.data().username)
            setPhoneNumber(doc.data().phoneNumber)
            setEyeColor(doc.data().eyeColor)
            setHairColor(doc.data().hairColor)
            setHeight(doc.data().height)
            setIdentifyingFeatures(doc.data().identifyingFeatures)
            setEmergencyName(doc.data().emergencyContactName)
            setEmergencyNumber(doc.data().emergencyContactNumber)
            setImage(doc.data().imageURl)
        })
    }, [])


    const getStarStatus = () => {
        const ref = doc(db, 'users', user.uid, 'friends', uid)
        getDoc(ref)
        .then((doc) => {
            setStar(doc.data().starStatus)
        }) 
    }
    
        
    const starFriend = async() => {
        if (star) {
            await updateDoc(doc(db, "users", user.uid, 'friends', uid), {
                starStatus: false
            });  
            setStar(false)
        } 
        if (!star) {
            await updateDoc(doc(db, "users", user.uid, 'friends', uid), {
                starStatus: true
            });  
            setStar(true)
        }
    }

    const removeFriend = async() => {
        try {
            await deleteDoc(doc(db, "users", user.uid, 'friends', uid))
            await deleteDoc(doc(db, "users", uid, 'friends', user.uid))
        } catch(e) {
        }
    }

    useEffect(() => {
        (async () => {
            await updateDoc(doc(db, "users", uid), {
                locationQuery: true
            })
        })();
    }, [])
    const leave = async() => {
        await updateDoc(doc(db, "users", uid), {
            locationQuery: false
        })
        navigation.navigate("BailOut")
    }


    return (
        <View style={styles.container}> 
            <View style={styles.backButtonView}> 
                <TouchableOpacity
                    onPress={leave}
                >
                    <Image
                        source={require('../assets/back_button.png')}
                        style={styles.backLogo}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.mainInfoView}>
                {image ? <Image source={{uri: image}} style={styles.CircleShape}/> : 
                        <Image source={require('../assets/gray-profile.png')} style={styles.CircleShape}/>} 
                <View style={styles.userNameView}>
                    <Text style={styles.nameText}>{fullName}</Text>
                    <Text style={styles.userNameText}> {username} </Text>
                </View>
            </View>

            <View style={styles.secondaryInfoView}>
                <View style={styles.secondaryInfoView2}>
                    <Image
                        source={require('../assets/gray-phone.png')}
                        style={styles.logos}
                    />
                    <Text style={styles.infoText}>{phoneNumber}</Text>
                </View>
                <View style={styles.secondaryInfoView2}>
                    <Image
                        source={require('../assets/gray-eye.png')}
                        style={styles.logos}
                    />
                    <Text style={styles.infoText}>{eyeColor}</Text>
                </View>
                <View style={styles.secondaryInfoView2}>
                    <Image
                        source={require('../assets/gray-hair.png')}
                        style={styles.logos}
                    />
                    <Text style={styles.infoText}>{hairColor}</Text>
                </View>
                <View style={styles.secondaryInfoView2}>
                    <Image
                        source={require('../assets/gray-height.png')}
                        style={styles.logos}
                    />
                    <Text style={styles.infoText}>{height}</Text>
                </View>
                <View style={styles.secondaryInfoView2}>
                    <Image
                        source={require('../assets/gray-person.png')}
                        style={styles.logos}
                    />
                    <Text style={styles.infoText}>{identifyingFeatures}</Text>
                </View>
                <View style={styles.secondaryInfoView2}>
                    <Image
                        source={require('../assets/gray-nurse.png')}
                        style={styles.logos}
                    />
                    <Text style={styles.infoText}>{emergencyName}</Text>
                </View>
                <View style={styles.secondaryInfoView2}>
                    <Image
                        source={require('../assets/emergency-gray.png')}
                        style={styles.logos}
                    />
                    <Text style={styles.infoText}>{emergencyNumber}</Text>
                </View>
            </View>
            <View style={styles.buttonView}>
                    <TouchableOpacity
                        onPress={starFriend}
                        style={styles.touchableOpacity}
                    >
                        {star ? 
                            <Image
                                source={require('../assets/star-fill-purple.png')}
                                style={styles.logos}
                            /> 
                        : 
                            <Image
                                source={require('../assets/star-empty-purple.png')}
                                style={styles.logos}
                            />
                        }
                        {star ? <Text style={styles.touchabelText}>Unstar Friend</Text> : 
                                <Text style={styles.touchabelText}>Star Friend</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity
                         onPress={() => navigation.navigate('FriendLocation', {paramKey: uid})}
                         style={styles.touchableOpacity}
                    >
                        <Image
                            source={require('../assets/location-purple.png')}
                            style={styles.logos}
                        />
                        <Text style={styles.touchabelText}>Get Location</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.touchableOpacity}
                        onPress={() => removeFriend()}
                    >
                        <Image
                            source={require('../assets/remove-friend-purple.png')}
                            style={styles.logoRemove}
                        />
                        <Text style={styles.touchabelText}>Remove Friend</Text>
                    </TouchableOpacity>
                </View>

        </View>
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
    },
    mainInfoView: {
        flex: 2,
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: '12%',
    },
    buttonView: {
        flex: 3,
        borderTopColor: '#800080',
        borderTopWidth: 2,
    },
    userNameView: {
        marginHorizontal: '8%',
    },
    secondaryInfoView: {
        flex: 6,
        marginHorizontal: '12%',
    },
    secondaryInfoView2: {
        flexDirection: 'row',
        marginVertical: '5.5%',
    },
    backLogo: {
        height: 20,
        width: 32,
        marginLeft: '14%'
    },   
    CircleShape: {
        width: 80,
        height: 80,
        borderRadius: 150 / 2,
    },
    nameText: {
        fontSize: 23,
        fontWeight: '500',
        marginVertical: '5%',
        fontFamily: 'Avenir-Roman'
    },
    userNameText: {
          color: '#787276',
          fontSize: 16,
          fontFamily: 'Avenir-Roman',
          fontWeight: '500',
    },
    logos: {
        height: 25,
        width: 25,
    },
    infoText: {
        marginHorizontal: '7%',
        color: '#787276',
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'Avenir-Roman'
    },
    touchableOpacity: {
        flexDirection: 'row',
        marginVertical: '5.5%',
        marginHorizontal: '12%',
    },
    touchabelText: {
        marginHorizontal: '7%',
        color: '#800080',
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'Avenir-Roman'
    },
    logoRemove: {
        height: 22,
        width: 25,
    }
})

export default FriendsProfileScreen