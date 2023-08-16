import React, {useState} from 'react'
import {Text, View, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, Image} from 'react-native'
import { useNavigation } from '@react-navigation/core'
import * as ImagePicker from 'expo-image-picker'
import { auth, db, storage } from '../firebase';
import {doc, setDoc} from 'firebase/firestore'
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';

const FirstRegisterInfoScreen = () => {
    const navigation = useNavigation()
    const user = auth.currentUser;
    const [userName, setUserName] = useState()
    const [fullName, setFullName] = useState()
    const [image, setImage] = useState(null);

    const uploadImageAsync = async (uri) => {
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
          const docRef = await setDoc(doc(db, "users", user.uid), {
            fullName: fullName,
            username: userName,
            imageURl: await getDownloadURL(storageRef),
          })
          return await getDownloadURL(storageRef);
        } catch(error) {
          console.log(error)
        }
        
      }

      async function saveInfo() {
        try {
            if (!image || !userName || !fullName) {
                alert("Please fill out all the fields")
            } else {
                const uploadURL = await uploadImageAsync(image)
                setImage(uploadURL)
                navigation.replace("Home")
            }
          } catch (e) {
            console.error("Error adding document: ", e);
          }
    }

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
          setImage(null)
        }
      };

    return (
        <SafeAreaView>
            <TouchableOpacity onPress={() => navigation.navigate("BailOut")}>
                <Text>Go Back</Text>
            </TouchableOpacity>
            <View>
                <Text style={styles.intoText}>Please fill out the information</Text>
                <TouchableOpacity onPress={pickImage}>
                    {image ? <Image source={{uri: image}} style={styles.CircleShape}/> : 
                        <Image source={require('../assets/gray-profile.png')} style={styles.CircleShape}/>} 
                </TouchableOpacity>
                
                <TextInput
                    style={styles.textInput}
                    placeholder='Full Name'
                    onChangeText={(text) => setFullName(text)}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder='User Name'
                    onChangeText={(text) => setUserName(text)}
                />
            </View>
            <View>
                <TouchableOpacity onPress={saveInfo}>
                    <Text>Save info</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    intoText: {
        fontSize: 20,
    },
    textInput: {
        width: '50%',
        height: '18%',
        borderColor:'black',
        borderWidth: 1,
        marginHorizontal: '2%',
        marginVertical: '2%'
    }, 
    CircleShape: {
        width: 80,
        height: 80,
        borderRadius: 150 / 2,
    },

})

export default FirstRegisterInfoScreen