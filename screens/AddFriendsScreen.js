import React, {useState, useEffect} from 'react'
import { SafeAreaView, TouchableOpacity, View, TextInput, Text, StyleSheet, Image, ActivityIndicator, FlatList  } from 'react-native'
import { auth, db } from '../firebase';
import {collection, query, where, getDocs, doc, setDoc, getDoc, updateDoc, deleteDoc, limit} from 'firebase/firestore'
import { useNavigation } from '@react-navigation/core'

const AddFriendsScreen = () => {

    const navigation = useNavigation()
    const user = auth.currentUser;

    const [search, setSearch] = useState([])
    const [friends, setFriends] = useState([])
    const [searchBar, setSearchBar] = useState(null)
    const [friendStatuses, setFriendStatuses] = useState({})

    async function addFriend(targetId) {   

        console.log("adding: ", targetId)

        try {
            // get the target's image url
            var targetImageURl;
            var targetFullName;
            var targetUsername;
            const targetDocRef = doc(db, 'users', targetId)
            getDoc(targetDocRef)
                .then((doc) => {
                    targetImageURl = doc.data().imageURl
                    targetFullName = doc.data().fullName
                    targetUsername = doc.data().username
                })

            // get the users's image url
            var uidImageURl;
            var uidFullName;
            var uidUsername;
            const userDocRef = doc(db, 'users', user.uid)
            getDoc(userDocRef)
                .then((doc) => {
                    uidImageURl = doc.data().imageURl
                    uidFullName = doc.data().fullName
                    uidUsername = doc.data().username
                })
            
            // check and see if the user is already in the local user's friends list and is inbound
            const q = query(collection(db, 'users', user.uid, 'friends'), where("__name__", '==', targetId), where('isFriend', '==', 'inbound'))
            const querySnapshot = await getDocs(q)

            // if the user is in the local user's friends list and is inbound, then accept the request
            if (querySnapshot.size > 0) {
                const docRef = await updateDoc(doc(db, "users", user.uid, "friends", targetId), {
                    isFriend: 'mutual'
                });
                // do the same for the target user
                const docRef2 = await updateDoc(doc(db, "users", targetId, "friends", user.uid), {
                    isFriend: 'mutual'
                });
                fetchFriendStatuses();
                return;
            }


            // if not then send an outbound request by adding the user to the local user's friends list as outbound 
            // and adding the local user to the user's friends list as inbound

            //Adds friend to the local list as outbound
            const docRef = await setDoc(doc(db, "users", user.uid, "friends", targetId), {
                isFriend: 'outbound',
                imageURl: targetImageURl,
                fullName: targetFullName,
                username: targetUsername,

            }, {merge: true})

            //Adds friend to the target list as inbound
            const docRef2 = await setDoc(doc(db, "users", targetId, "friends", user.uid), {
                isFriend: 'inbound',
                imageURl: uidImageURl,
                fullName: uidFullName,
                username: uidUsername,
            }, {merge: true})

            fetchFriendStatuses();

        } catch (err) {
            console.log('add error: ' + targetId);
            console.log(user.uid);
        } 
    }

    useEffect(() => {
        fetchFriendStatuses();
    }, [friends]);
    
    //Fetches the status of the users friends.
    //This function allows the ability to set the status of the button based on 
    //the status of the user's friends.
    const fetchFriendStatuses = async () => {
        try {
          const q = query(collection(db, 'users', user.uid, 'friends'));
          const querySnapshot = await getDocs(q);
          
          const statuses = {};
          querySnapshot.forEach((doc) => {
            statuses[doc.id] = doc.data().isFriend;
          });
        
          setFriendStatuses(statuses);
        } catch (error) {
          console.error("Error fetching friend statuses: ", error);
        }
    };

    async function removeFriend(targetId) {
        try {
            // check and see if the user is already in the local user's friends list
            const q = query(collection(db, 'users', user.uid, 'friends'), where("__name__", '==', targetId))
            const querySnapshot = await getDocs(q)

            // if the user is in the local user's friends list, then remove them
            if (querySnapshot.size > 0) {
                const docRef = await deleteDoc(doc(db, "users", user.uid, "friends", targetId));
                 // do the same for the target user
                const q2 = query(collection(db, 'users', targetId, 'friends'), where("__name__", '==', user.uid))
                const querySnapshot2 = await getDocs(q2)
                if (querySnapshot2.size > 0) {
                    const docRef2 = await deleteDoc(doc(db, "users", targetId, "friends", user.uid));
                }
            }

            fetchFriendStatuses();
           
        } catch (err) {
            console.log('error when removing friend');
            console.log(id);
        }
    }

    useEffect(() => {
        friendList();
        loadSearch();
    }, [])

    //Gets the user's list of friends
    const friendList = async () => {
        try {
            const q = query(collection(db, 'users', user.uid, 'friends'))
            const querySnapshot = await getDocs(q)
            const array = []
            querySnapshot.forEach((doc) => {
                array.push({
                    key: doc.id,
                    isFriend: doc.data().isFriend,
                })
            })
            setFriends(array)
        } catch(e) {
        }
    }

    // used to see the relationship between local user and target
    // returns a button JSX component with the correct text and onPress function
    // can be in one of four states:
    // mutual friends - both users have each other as friends
    // outbound - local user has requested target
    // inbound - target has requested local user
    // not friends - neither user is in the other's friends list
    // Template button:
    const checkFriend = (targetId) => {
        const isFriend = friendStatuses[targetId];
        if (isFriend === 'mutual') {
            return (
                <TouchableOpacity 
                    style={styles.addButton} 
                    onPress={() => removeFriend(targetId)}
                >
                    <Text 
                    style={styles.buttonText}
                    
                    >Remove Friend</Text>
                </TouchableOpacity>
            );
        } else if (isFriend === 'outbound') {
            return (
                <TouchableOpacity 
                    style={styles.addButton} 
                    onPress={() => removeFriend(targetId)}
                >
                    <Text 
                    style={styles.buttonText}
                    >Unsend Request</Text>
                </TouchableOpacity>
            );
        } else if (isFriend === 'inbound') {
            // if only the local user is in the target's friends list, then the relationship is requested
            return (
                <TouchableOpacity 
                    style={styles.addButton} 
                    onPress={() => addFriend(targetId)}
                >
                    <Text
                    style={styles.buttonText}
                    
                    >Accept</Text>
                </TouchableOpacity>
            );
        } else {
            // if neither are true, then the relationship is not friends
            return (
                <TouchableOpacity 
                    style={styles.addButton} 
                    onPress={() => addFriend(targetId)}
                >
                    <Text
                    style={styles.buttonText}
                    >Add Friend</Text>
                </TouchableOpacity>
            );
        }
    }


    //Loads the people that the user searches for
    async function loadSearch() {
        const array = []
          try {
            let q
            if (!searchBar) {
                q = query(collection(db, "users"), limit(20));
            } else {
                q = query(collection(db, "users"), limit(20), where('username', '>=', searchBar), where('username', '<=', searchBar + '~'));
            }
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach((doc) => {
                if (doc.id != user.uid) {
                    array.push({
                        username: doc.data().username,
                        fullName: doc.data().fullName,
                        imageURl: doc.data().imageURl,
                        key: doc.id,
                    })
                }
            });
            setSearch(array)
        } catch (err) {
        }
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topView}>
                <TouchableOpacity
                    onPress={() => navigation.jumpTo("BailOut")}
                >
                    <Image
                        source={require('../assets/back_button.png')}
                        style={styles.backLogo}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.jumpTo("Requested")}>
                    <Text>Requested</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.searchView}>
                <View style={styles.serchBarView}>
                    <Image
                        source={require('../assets/search.png')}
                        style={styles.logos}
                    />
                    <TextInput 
                        placeholder='Search' 
                        style={styles.textInput}
                        onChangeText={(text) => setSearchBar(text)}
                        onKeyPress={loadSearch}
                    />
                </View>

                <View style={styles.listView}>
                   <FlatList
                    data={search}
                    keyExtractor={item => item.key}
                    renderItem={({item}) => <View  style={styles.profileView}>
                        <View style={styles.profileAndNameView}>
                            <View style={styles.profilePicView}>
                                <Image
                                    source={{uri: item.imageURl}}
                                    style={styles.profilePic}
                                />
                            </View>
                            <View style={styles.namesView}>
                                <Text style={styles.text}>{item.fullName}</Text>
                                <Text style={styles.text}>{item.username}</Text>
                            </View>
                        </View>
                        <View style={styles.buttonView}>
                            {checkFriend(item.key)}
                        </View>
                    </View>}
                   />

                </View>
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
       flex: 1
    },
    topView: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: '12%',
        justifyContent: 'space-between'
    },
    searchView: {
        flex: 12,
    },
    serchBarView: {
        flexDirection: 'row',
        marginHorizontal: '12%',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        height: '5.8%',
    },
    listView: {
        marginTop: 5,
        flex: 1
    },
    profileView: {
        flexDirection: 'row',
        height: 70,
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1
    },
    profileAndNameView: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    },
    buttonView: { 
        flex: 1,
        alignItems: 'center'
    },
    profilePicView: {
        marginLeft: '4%',
    },
    namesView: {
        marginLeft: '3%',
    },
    backLogo: {
        height: 20,
        width: 32,
    },  
    textInput: {
        height: 30,
        width: '90%',
        marginTop: '1%',
        fontSize: 16,
        marginLeft: '2%',
    }, 
    logos: {
        height: 30,
        width: 30,
        marginLeft: '1%',
        marginTop: '1%',
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
    addButton: {
       // marginLeft: '10%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#800080',
        height: '45%',
        borderRadius: 6,
        width: '80%'
    },
    buttonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '700',
        fontFamily: 'Avenir-Roman',
    }
})

export default AddFriendsScreen