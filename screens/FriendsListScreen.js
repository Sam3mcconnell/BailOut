import {Dimensions, StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { auth, db } from '../firebase';
import {collection, query, where, onSnapshot} from 'firebase/firestore'
import { useNavigation } from '@react-navigation/core'

const {height: SCREEN_HEIGHT} = Dimensions.get('window')
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 80

const FriendsListScreen = () => {
    const translateY = useSharedValue(0);

    const context = useSharedValue({ y: 0 })
    const gesture = Gesture.Pan()
        .onStart(() => {
            context.value = {y: translateY.value}
        }).onUpdate((event) => {
            translateY.value = event.translationY + context.value.y
            translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y)
        }).onEnd(() => {
            if (translateY.value > -SCREEN_HEIGHT/2) {
                translateY.value = withTiming(-SCREEN_HEIGHT / 13)
            } else {
                if (translateY.value < -SCREEN_HEIGHT/2) {
                    translateY.value = withTiming(MAX_TRANSLATE_Y)
                }
            }
    })


    useEffect(() => {
        translateY.value = withTiming(-SCREEN_HEIGHT / 13)
    }, [])

    const rBottomSheetStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value}]
        }
    })

    //To get the friends list
    const user = auth.currentUser;
    const navigation = useNavigation()
    
    const [friends, setFriends] = useState([])

    const loadFriends = async() => {
            const q = query(collection(db, "users", user.uid, 'friends'), where('isFriend', '==', 'mutual'));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const array = []
                querySnapshot.forEach((doc) => {
                    array.push({
                        key: doc.id,
                        fullName: doc.data().fullName,
                        username: doc.data().username,
                        imageURl: doc.data().imageURl,
                    }) 
                });
                setFriends(array)
        })
    }
    
    useEffect(() => {
        loadFriends()
    }, [])


    return ( 
        <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}> 
                
                <View style={styles.line}> 
                </View>
                <View style={styles.titleView}>
                    <Text style={styles.noFriendsText}>Your Friends</Text>
                </View>
                <View style={styles.listView}>
                    <FlatList
                        data={friends}
                        keyExtractor={item => item.key}
                        renderItem={({item}) => 
                        <TouchableOpacity onPress={() => navigation.navigate('FriendsProfile', {paramKey: item.key})}>
                            <View style={styles.profileView}> 
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
                        </TouchableOpacity>
                        }
                    />
                </View>
            </Animated.View>
        </GestureDetector>
    )
}

const styles = StyleSheet.create({
    bottomSheetContainer: {
        height: SCREEN_HEIGHT,
        width: '100%',
        backgroundColor: '#efefef',
        position: 'absolute',
        top: SCREEN_HEIGHT,
        flex: 1
    },
    listView: {
        flex: 24,
    },
    titleView: {
        marginTop: '8%',
        flex: 1,
    },
    line: {
        width: 75,
        height: 4,
        backgroundColor: 'gray',
        borderRadius: 2,
        marginVertical: 15,
        alignSelf: 'center'
    },
    profileView: {
        flex: 1,
        flexDirection: 'row',
        height: 80,
        alignItems: 'center',
    },
    profilePicView: {
        marginLeft: '4%',
    },
    namesView: {
        marginLeft: '3%',
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
})

export default FriendsListScreen