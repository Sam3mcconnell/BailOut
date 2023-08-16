import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, Button } from 'react-native';
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useNavigation } from '@react-navigation/core'

const ChangePinScreen = () => {

  const navigation = useNavigation();

  const [hasPin, setHasPin] = useState(null);
  const [pin, setPin] = useState('');
  const [bigText, setBigText] = useState('');
  const [submitBtn, setSubmitBtn] = useState('???');


  // check if user has a pin set
  // runs whenever component updates
  useEffect(() => {
    const userDoc = doc(db, 'users', auth.currentUser.uid);
    getDoc(userDoc).then((doc) => {
      if (doc.exists && doc.data().pin) {
        setHasPin(true);
      } else {
        setHasPin(false);
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  }, []);

  // change text depending on whether pin is set
  useEffect(() => {
    if (hasPin === null) {
      // state not loaded yet, don't show anything
      setBigText('');
    } else if (hasPin) {
      setBigText('Enter your old PIN');
      setSubmitBtn('Remove PIN');
    } else {
      setBigText('Create a new PIN');
      setSubmitBtn('Set new PIN');
    }
  }, [hasPin]);

  const handleSetPin = async () => {

    if (pin.length !== 4) {
      setBigText('PIN must be 4 digits long');
      return;
    }

    // boilerplate to access the PIN
    const userDoc = doc(db, 'users', auth.currentUser.uid);
    try {
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        const oldPin = docSnap.data().pin;
        if (oldPin == null) {
          await updateDoc(userDoc, { pin: pin });
          setPin('');
          setHasPin(true);
          navigation.jumpTo("EditProfile");
          return;
        } else if (oldPin === pin) {
          await updateDoc(userDoc, { pin: null });
          setHasPin(false);
          setBigText('Correct PIN');
          setPin('');
        } else {
          setBigText('Incorrect PIN, enter: ' + oldPin);
          setPin('');
          return;
        }
      } else {
        throw new Error('User document does not exist');
      }
    } catch (error) {
      console.log("Error getting document:", error);
    }  
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{bigText}</Text>
      <TextInput
        value={pin}
        onChangeText={setPin}
        placeholder='Enter 4-digit PIN'
        keyboardType='numeric'
        secureTextEntry={true}
        maxLength={4}
      />
      <Button title={submitBtn} onPress={handleSetPin} />
      <Button
        title='Go back'
        onPress={() => {
          if (hasPin) {
            navigation.jumpTo("EditProfile");
          } else {
            // change text
            setBigText('You must set a PIN!');
          }
        }}
      />
    </SafeAreaView>
  );
};

// Other code ...


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ChangePinScreen;
