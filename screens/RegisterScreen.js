import { KeyboardAvoidingView, TouchableOpacity, View, Text, StyleSheet, Image} from "react-native";
import { useNavigation } from '@react-navigation/core'
import React, { useEffect } from 'react'
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const RegisterScreen = () => {

    const navigation = useNavigation()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
          if (user) {
            navigation.navigate("Home")
          }
        })
        return unsubscribe
      }, [])

    const debugLogin = () => {
        signInWithEmailAndPassword(auth, "Shawarma@gmail.com", "Shawarma")
        .then(userCredentials => {
          const user = userCredentials.user;
          console.log('Logged in with:', user.uid);
        })
        .catch(error => alert(error.message))
    }


    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.container1}>
                
                    <Image
                      source={require('../assets/bailout-logo.png')}
                      style={styles.bailoutLogo}
                    />
                    <Text
                    style={styles.bailoutText}
                    > BailOut </Text> 
        
            </View>

            <View style={styles.container2}>
                <TouchableOpacity style={styles.button} onPress={() => {debugLogin()}}>
                    <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>
                            Debug Login Shawarma
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <View style={styles.buttonContent}>
                        <Image
                           source={require('../assets/apple-logo.png')}
                          style={styles.logo}
                        />
                        <Text
                            style={styles.buttonText}
                            >Continue with Apple</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} >
                    <View style={styles.buttonContent}>
                        <Image
                           source={require('../assets/google-logo.png')}
                          style={styles.logo}
                        />
                        <Text
                            style={styles.buttonText}
                            >Continue with Google</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity 
                style={styles.button}
                onPress={() => {}}
                >
                    <View style={styles.buttonContent}>
                        <Image
                           source={require('../assets/phone-logo.png')}
                          style={styles.logo}
                        />
                        <Text
                            style={styles.buttonText}
                            >Continue with Phone</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate("Email")}
                >
                    <View style={styles.buttonContent}>
                        <Image
                           source={require('../assets/email-logo.png')}
                          style={styles.logo}
                        />
                        <Text
                            style={styles.buttonText}
                            >Continue with Email</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    container : {
        flex: 1,
    },
    container1: {
        flex: 6,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    
    container2: {
        flex: 4,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-top',
    },

    button: {
        margin: '3%',
        borderColor: 'black',
        borderWidth: '2%',
        borderRadius: '5%',
        width: '75%',
        height: '12%',
         justifyContent: 'center',

    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
      },

    logo: {
        marginHorizontal: '8%',
        width: '8%',
        height: '140%',
      },

    buttonText: {
        marginHorizontal: "6%",
        textAlign: 'center',
        color: 'black',
        fontWeight: 'bold',
    },
    bailoutLogo: {
        margin: '40%',
        width: '40%',
        height: '30%',
    },
    bailoutText: {
        margin: '-37%',
        fontSize: 40,
        fontWeight: 'bold',
    },


  });

export default RegisterScreen
