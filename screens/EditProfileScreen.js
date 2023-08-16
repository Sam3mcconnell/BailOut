import React, { useState, useEffect } from 'react'
import {View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Button, Alert} from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { auth, db, storage } from '../firebase';
import {doc, getDoc, setDoc, updateDoc} from 'firebase/firestore'
import * as ImagePicker from 'expo-image-picker'
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';


const EditProfileScreen = () => {

    const navigation = useNavigation()
    const user = auth.currentUser

    // user data
    const [fullName, setFullName] = useState('')
    const [username, setUserName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [eyeColor, setEyeColor] = useState('')
    const [hairColor, setHairColor] = useState('')
    const [height, setHeight] = useState('')
    const [identifyingFeatures, setIdentifyingFeatures] = useState('')
    const [emergencyName, setEmergencyName] = useState('')
    const [emergencyNumber, setEmergencyNumber] = useState('')
    const [image, setImage] = useState(null)
    const [downloadImage, setDownloadImage] = useState(null)

    const [oldData, setOldData] = useState(null);


    const [newData, setNewData] = useState({
        fullName: null,
        username: null,
        phoneNumber: null,
        eyeColor: null,
        hairColor: null,
        height: null,
        identifyingFeatures: null,
        emergencyContactName: null,
        emergencyContactNumber: null,
    });

    useEffect(() => {
        // Fetch the old data from the database and update the state
        const fetchData = async () => {
          try {
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              setOldData(data); // Store the old data in the state
              setImage(data.imageURl);
            }
          } catch (error) {
            console.error('Error fetching data: ', error);
          }
        };
    
        fetchData();
      }, []);

    const placeholderText = {
        fullName: 'Full Name',
        username: 'Username',
        phoneNumber: 'Phone Number',
        eyeColor: 'Eye Color',
        hairColor: 'Hair Color',
        height: 'Height',
        identifyingFeatures: 'Identifying Features',
        emergencyContactName: 'Emergency Contact Name',
        emergencyContactNumber: 'Emergency Contact Number',
    }

    const renderTextInput = (field) => {
        return (
          <View>
            <Text>{placeholderText[field]}</Text>
            <TextInput
              placeholder={placeholderText[field]}
              value={getFieldValue(field)}
              style={styles.textInput}
              onChangeText={(text) => handleInputChange(field, text)}
            />
          </View>
        );
    };

    const handleInputChange = (field, value) => {
        setNewData((prevData) => ({
          ...prevData,
          [field]: value,
        }));
    };

    const pickImage = async () => {

        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.1,
        });
    
        if (!result.canceled) {
          setImage(result.assets[0].uri)
        } else{
          setImage(null);
        }
    };

    const uploadImageAsync = async (uri) => {
      if (!uri) {
        setImage(null);
        return;
      }
      const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });
      
      try {
        const storageRef = ref(storage, `image/${user.uid}`)
        const result = await uploadBytes(storageRef, blob)
        blob.close()
        const docRef = await updateDoc(doc(db, "users", user.uid), {
          imageURl: await getDownloadURL(storageRef),
        })
        return await getDownloadURL(storageRef);
      } catch(error) {
        console.log(error)
      }  
    };
    
    async function saveInfo() {
        try {
          // Check if each field has been edited and update only the edited properties
          for (const field in newData) {
            if (newData.hasOwnProperty(field) && newData[field] !== null) {
              await setDoc(doc(db, "users", user.uid), {
                [field]: newData[field]
              }, {merge: true});
            }
          }
          // Upload the image if it has been changed
          if (image) {
            await uploadImageAsync(image);
          } else {
            // MINOR BUG: setting the imageURl to null doesn't work for some reason
            // I tried to debug with alert but it doesnt alert on either branch
            await updateDoc(doc(db, "users", user.uid), {
              imageURl: null
            });
          }
          // Navigation and other actions after saving
          navigation.jumpTo("LocalProfile");
        } catch (error) {
          console.error("Error updating document: ", error);
        }
    };
    
    const getFieldValue = (field) => {
        if (newData[field] !== null && newData[field] !== undefined) {
            return newData[field];
        } else if (oldData && oldData[field] !== null && oldData[field] !== undefined) {
            return oldData[field];
        }
    };
              

    return (
        <View style={styles.container}>
            <View style={styles.editView}>
                <TouchableOpacity 
                    style={styles.pictureView}
                    onPress={pickImage}
                >
                  {image ? <Image source={{uri: image}} style={styles.CircleShape}/> : <Image source={require('../assets/gray-profile.png')} style={styles.CircleShape}/>} 
                    <Text>Change Picture</Text>
                </TouchableOpacity>
                {renderTextInput("fullName")}
                {renderTextInput("username")}
                {renderTextInput("phoneNumber")}
                {renderTextInput("eyeColor")}
                {renderTextInput("hairColor")}
                {renderTextInput("height")}
                {renderTextInput("identifyingFeatures")}
                {renderTextInput("emergencyContactName")}
                {renderTextInput("emergencyContactNumber")}
            </View>

            <View style={styles.buttonView}>
                <TouchableOpacity 
                    style={styles.touchableOpacity}
                    onPress={saveInfo}
                >
                    <Image
                        source={require('../assets/save_logo.png')}
                        style={styles.logos}
                    />
                    <Text style={styles.touchabelText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.touchableOpacity}
                  onPress={() => navigation.jumpTo("ChangePin")}
                >
                  <Image
                        source={require('../assets/key_logo.png')}
                        style={styles.keyLogo}
                    />
                  <Text style={styles.touchabelText}>Change PIN</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.jumpTo("LocalProfile")}
                    style={styles.touchableOpacity}
                >
                    <Image
                        source={require('../assets/cancel_logo.png')}
                        style={styles.logos}
                    />
                    <Text style={styles.touchabelText}>Cancel</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,  
    },
    editView: {
        flex: 9,
        marginHorizontal: '12%',
        marginTop: '12%',
        justifyContent: 'space-around'
    },
    buttonView: {
        flex: 3,
        marginVertical: '2%',
        marginTop: '5%',
        justifyContent: 'space-evenly',
        borderTopColor: '#800080',
        borderTopWidth: 2,
    },
    CircleShape: {
        width: 100,
        height: 100,
        borderRadius: 150 / 2,
    },
    pictureView: {
        alignItems: 'center'
    },
    textInput: {
        borderColor: 'black',
        borderWidth: 1,
        height: 30,
        borderRadius: 5,
    },
    touchableOpacity: {
      flexDirection: 'row',
      marginVertical: '5.5%',
      marginHorizontal: '12%',
      height: '25%',
      alignItems: 'center'
    },
    touchabelText: {
      marginHorizontal: '7%',
      color: '#800080',
      fontSize: 16,
      fontWeight: '500',
      fontFamily: 'Avenir-Roman'
    }, 
    logos: {
      height: '58%',
      width: '11%',
    },
    keyLogo: {
      height: '70%',
      width: '6%',
      marginHorizontal: '2.5%'
    }
})

export default EditProfileScreen