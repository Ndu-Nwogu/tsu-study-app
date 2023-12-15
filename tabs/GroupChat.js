import { SafeAreaView, StyleSheet, Text, View, FlatList, TextInput, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import { useEffect, useState, useRef } from 'react';
import 'firebase/compat/auth'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from '../database/firebaseConfig';
import { getDatabase, ref, set,onValue,off, get, push } from 'firebase/database';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const GroupChat = ({ route }) => {
    const navigation = useNavigation();
    const { groupId } = route.params;
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [groupName, setGroupName] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const db = getDatabase();
    const currentUser = getAuth().currentUser;

    const flatListRef = useRef();
    const messagesEndRef = useRef(); 

    const isCurrentUser = (senderId) => {
        return currentUser && senderId === currentUser.uid;
    };
    
    function handleMain(){
        navigation.navigate("MainPage")
    }
    const fetchUsername = async (userId) => {
        const userRef = ref(db, `UserInformation/${userId}`);
        const snapshot = await get(userRef);
        return snapshot.val() && snapshot.val().Username;
    };

    const sendMessage = async () => {
        if (newMessage.trim().length === 0) return; // Don't send empty messages

        const messagesRef = ref(db, `Groups/${groupId}/messages`);
        const newMessageRef = push(messagesRef);
        set(newMessageRef, {
            text: newMessage,
            senderId: currentUser.uid,
            timestamp: new Date().toISOString()
        }).then(() => {
            setNewMessage(''); // Clear the input field after sending
            messagesEndRef.current?.scrollToEnd({ animated: true });
        }).catch((error) => {
            console.error('Error sending message:', error);
        });
        if (groupData.messages) {
            const messagesList = Object.values(groupData.messages)
                .sort((a, b) => a.timestamp.localeCompare(b.timestamp)) // Sort by timestamp
                .map((message, index) => ({
                    id: index.toString(), // Since .push() keys are not fetched, we use index as key
                    ...message
                }));
            setMessages(messagesList);
        }
        
    };
    flatListRef.current?.scrollToEnd({ animated: true });
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);  // Dependency array includes messages, so it runs whenever messages change
    
    useEffect(() => {
        const groupRef = ref(db, `Groups/${groupId}`);

        const unsubscribeGroup = onValue(groupRef, async (snapshot) => {
            const groupData = snapshot.val();
            setGroupName(groupData.name); // Set the group name

            if (groupData.messages) {
                const messagesPromises = Object.keys(groupData.messages).map(async (key) => {
                    const message = groupData.messages[key];
                    const Username = await fetchUsername(message.senderId);
                    return { id: key, Username, ...message };
                });

                const resolvedMessages = await Promise.all(messagesPromises);
                setMessages(resolvedMessages);
            } else {
                setMessages([]);
            }
            setLoading(false);
        });

        return () => {
            off(groupRef); // Unsubscribe on unmount
        };
    }, [groupId]);

    

    return (
        <SafeAreaView style={{flex:1, backgroundColor:"#191919", alignContent:"center", justifyContent:"center"}}>
        <KeyboardAvoidingView behavior='padding' style={{flex:1}}>
        <View style={styles.menuBar}>
            {/* <TouchableOpacity activeOpacity={0.8} onPress={handleMain}>
                <Ionicons name='arrow-back' size={32} color={"#FFD700"}/>
            </TouchableOpacity> */}
            <Text style={{fontSize:20,color:"white"}}> {groupName || "Loading..."}</Text> 
        </View>
            <FlatList
                ref={messagesEndRef}
                data={messages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={[ styles.container, isCurrentUser(item.senderId),
                            isCurrentUser(item.senderId) ? {alignSelf: 'flex-end'} : {alignSelf: 'flex-start'}]}>
                        <View style={{marginLeft:10}}>
                            <Text style={{color: 'white'}}>{item.Username || "Unknown user"}</Text>
                        </View>
                        <View style={[
                            styles.chatBubble, 
                            isCurrentUser(item.senderId) ? styles.currentUserBubble : styles.otherUserBubble,
                            isCurrentUser(item.senderId) ? {alignSelf: 'flex-end'} : {alignSelf: 'flex-start'}
                        ]}>
                            <Text style={{ color: 'white', marginBottom:5 }}>{item.text}</Text>
                            <Text style={{ fontSize: 10, color: '#BCBABA' }}>{new Date(item.timestamp).toLocaleString()}</Text>
                        </View>
                    </View>
                )}
                style={{ flex: 1 }}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message..."
                    placeholderTextColor={"#fff"}
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default GroupChat

const styles = StyleSheet.create({
    chatBubble:{
        backgroundColor:"#7C183E",
        padding:10,
        maxWidth:150,
        borderRadius:15,
        borderBottomRightRadius:0,
        margin:10
    },
    menuBar:{
        margin:20,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
    },
    currentUserBubble: {
        backgroundColor: "#7C183E",
        borderBottomRightRadius: 0, 
        borderBottomLeftRadius: 15, 
    },
    otherUserBubble: {
        backgroundColor: "#008080",
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 15, 
    },
    container:{
        marginLeft:10,
        marginRight:10
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 20,
        borderTopWidth:0.5,
        borderColor:"#333",
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        color: 'white',
        backgroundColor: '#333',
        marginTop:20
    },
    sendButton: {
        marginLeft: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#E1C425',
        borderRadius: 20,
        marginTop:20
    },
    sendButtonText: {
        color: 'white',
        fontWeight:"600"
    },
})