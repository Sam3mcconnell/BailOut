import React, {useState, useEffect, useRef, useCallback} from 'react'
import {Text, StyleSheet, View, TouchableOpacity, Image} from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { signOut } from "firebase/auth";
import { auth, db, storage } from '../firebase';
import {doc, getDoc, onSnapshot } from 'firebase/firestore'
import { ref, getDownloadURL } from 'firebase/storage' 
import AsyncStorage from '@react-native-async-storage/async-storage';

const LocalProfileScreen = () => {


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



    const navigation = useNavigation()
    const user = auth.currentUser;    

    // if (!image) {
    //     const imgRef = ref(storage, `image/${user.uid}`)
    //     getDownloadURL(imgRef).then((url) => {
    //         setImage(url)
    //     })
    // }

    
        
     
    onSnapshot(doc(db, "users", user.uid), (doc) => {
        setImage(doc.data().imageURl)
    });
    
        

    

    const docRef = doc(db, 'users', user.uid)
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
        })

    // const fetchProfileData = async() => {
    //     try {
    //         const storedProfileImage = await AsyncStorage.getItem('profileImage');
    //         if (storedProfileImage) {
    //             image = storedProfileImage
    //             console.log("yes")
    //         } else {
    //             const docRef = doc(db, 'users', user.uid)
    //             getDoc(docRef)
    //                 .then((doc) => {
    //                     image = doc.data().imageURl
    //                 })
                
    //             await AsyncStorage.setItem('profileImage', image);
    //             console.log("no")
    //         }

    //     } catch(error) {
    //         console.log("Trouble fetching profile data", error)
    //     }
    // }
    
    // useEffect(() => {
    //     fetchProfileData()
    // }, [])

    const handleSignOut = () => {
        signOut(auth).then(() => {
            navigation.replace("Register")
          }).catch((error) => {
            // An error happened.
            console.log("Sorry")
          });
    }

    return (
        <View style={styles.container}> 
            <View style={styles.backButtonView}> 
                <TouchableOpacity
                    onPress={() => navigation.jumpTo("BailOut")}
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
                <TouchableOpacity style={styles.editAndInfoButton} onPress={() => navigation.jumpTo("EditProfile")}>
                    <Image
                        source={require('../assets/purple-edit.png')}
                        style={styles.logos}
                    />
                    <Text style={styles.editAndInfoText}>Edit Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.editAndInfoButton}>
                    <Image
                        source={require('../assets/purple-info.png')}
                        style={styles.logos}
                    />
                    <Text style={styles.editAndInfoText}>Why all the information?</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity 
                style={styles.logOutButtonView}
                onPress={handleSignOut}
            >
                <View style={styles.logOutButton}>
                    <Image
                        source={require('../assets/red-logout.png')}
                        style={styles.logos}
                    />
                    <Text style={styles.logOutText}>Log Out</Text>
                </View>
            </TouchableOpacity>
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
    buttonView: {
        flex: 2,
        borderTopColor: '#800080',
        borderTopWidth: 2,
    },
    logOutButtonView: {
        flex: 1,
        borderTopColor: '#A52A2A',
        borderTopWidth: 2,
        justifyContent: 'center',

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
    editAndInfoButton: {
        flexDirection: 'row',
        marginVertical: '5.5%',
        marginHorizontal: '12%',
    },
    editAndInfoText: {
        marginHorizontal: '7%',
        color: '#800080',
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'Avenir-Roman'
    },
    logOutButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logOutText: {
        marginHorizontal: '2%',
        color: '#A52A2A',
        fontSize: 19,
        fontWeight: 'bold',
        fontFamily: 'Avenir-Roman'
    }
})


export default LocalProfileScreen