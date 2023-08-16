import React, {useState} from 'react'
import {Text, View, StyleSheet, TextInput, TouchableOpacity} from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

const EmailRegisterScreen = () => {

    const navigation = useNavigation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleRegister = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then(userCredentail => {
            const user = userCredentail.user;
            navigation.replace("FirstRegisterInfo")
            
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        })
    }

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
          const user = userCredentials.user;
          navigation.navigate("Home")
          console.log('Logged in with:', user.uid);
        })
        .catch(error => alert(error.message))
    }

    return (
        <View style={styles.container}> 

            <View style={styles.textInputContainer}>
                <TextInput
                    placeholder='Email'
                    style={styles.textInput}
                    onChangeText={(text) => setEmail(text)}
                >
                </TextInput>
                <TextInput
                    placeholder='Password'
                    style={styles.textInput}
                    onChangeText={(text) => setPassword(text)}
                >
                </TextInput>

            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                >
                    <Text>Log In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleRegister()}
                >
                    <Text>Register</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.backContainer}>
                <TouchableOpacity  
                    onPress={() => navigation.navigate("Register")}
                >
                    <Text>Continue with a different method?</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    textInputContainer: {
        flex: 7,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    buttonContainer: {
        flex: 7,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    backContainer: {
        flex: 2,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: '5%'
    },

    textInput: {
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 5,
        height: '10%',
        width: '80%',
        margin: '3%',
    },
    button: {
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 5,
        height: '6%',
        width: '40%',
        marginTop: '4%',
        alignItems: 'center',
        justifyContent: 'center',
    }

})


export default EmailRegisterScreen