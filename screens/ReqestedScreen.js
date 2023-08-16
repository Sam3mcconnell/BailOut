import React, {useState, useEffect} from 'react'
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { auth, db } from '../firebase';
import {collection, query, where, doc, updateDoc, deleteDoc, onSnapshot} from 'firebase/firestore'

const RequestedScreen = () => {
    const navigation = useNavigation()
    const user = auth.currentUser;
    const [friends, setFriends] = useState([])

    
    useEffect(() => {
        loadFriends()
    }, [])

    async function loadFriends() {
        try {
            const q = query(collection(db, "users", user.uid, 'friends'), where('isFriend', '==', 'inbound'));
            onSnapshot(q, (querySnapshot) => {
                const array = []
                querySnapshot.forEach((doc) => {
                    array.push({
                        key: doc.id,
                        imageURl: doc.data().imageURl,
                        fullName: doc.data().fullName,
                        username: doc.data().username
                    })
                });
                setFriends(array)
            })
        } catch (e) {
            console.log('bad')
        }
    }

    async function acceptFriend(targetId) {   
        await updateDoc(doc(db, "users", user.uid, "friends", targetId), {
            isFriend: 'mutual'
        });
        // do the same for the target user
        await updateDoc(doc(db, "users", targetId, "friends", user.uid), {
            isFriend: 'mutual'
        });
        loadFriends()
    }

    async function rejectFirend(targetId) {
        await deleteDoc(doc(db, "users", user.uid, "friends", targetId));
        await deleteDoc(doc(db, "users", targetId, "friends", user.uid));
        loadFriends()
    }

    const checkLength = () => {
        if (friends.length == 0) {
            return true
        } else {
            return false
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topView}>
                <TouchableOpacity onPress={() => navigation.jumpTo("AddFriends")}>
                    <Image
                        source={require('../assets/back_button.png')}
                        style={styles.backLogo}
                    />
                </TouchableOpacity>
                
            </View>
            <View style={styles.listView}>
                {checkLength() ? <Text style={styles.noFriendsText}>No Friend Requests</Text> : 
                <FlatList
                    data={friends}
                    keyExtractor={item => item.key}
                    renderItem={({item}) => 
                    <View style={styles.profileView}>
                        <View style={styles.profilePicView}>
                            <Image
                                source={{uri: item.imageURl}}
                                style={styles.profilePic}
                            />
                            <View style={styles.namesView}>
                                <Text style={styles.text}>{item.fullName}</Text>
                                <Text style={styles.text}>{item.username}</Text>
                            </View>
                        </View>
                        
                        <View style={styles.buttonView}>
                            <TouchableOpacity onPress={() => acceptFriend(item.key)}>
                                <Image
                                    source={require('../assets/purple-check.png')}
                                    style={styles.logo}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => rejectFirend(item.key)}>
                                <Image
                                    source={require('../assets/red-x.png')}
                                    style={styles.logo}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>}
                />}
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    }, 
    topView: {
        flex: 1,
        marginHorizontal: '13%'
    }, 
    listView: {
        flex: 13,
    },
    backLogo: {
        height: 20,
        width: 32,
    }, 
    profileView: {
        flexDirection: 'row',
        height: 70,
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1
    },
    profilePicView: {
        marginLeft: '4%',
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    namesView: {
        marginLeft: '5%',
    },
    profilePic: {
        height: 60,
        width: 60,
        borderRadius: 150 / 2,
    },
    text: {
        fontSize: 16,
        fontFamily: 'Avenir-Roman',
    },
    noFriendsText: {
        fontSize: 20,
        fontWeight: '500',
        fontFamily: 'Avenir-Roman',
        alignSelf: 'center',
    },
    buttonView: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '50%', 
        flexDirection: 'row',
        flex: 1,
    },
    logo: {
        height: 30,
        width: 30,
        marginHorizontal: '5%'
    },
})


export default RequestedScreen