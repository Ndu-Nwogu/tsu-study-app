import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, View, } from 'react-native'
import { Image } from 'react-native'
import React from 'react'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native';
import 'firebase/compat/auth'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from '../database/firebaseConfig';
import { getDatabase, ref, set } from 'firebase/database';
import { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import MyInputText from '../components/MyInputText'
import MyButton from '../components/MyButton'
import MyLogo from '../components/MyLogo'

const SignUp = () => {

    const navigation = useNavigation();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')

   const handleSignUp = async () => {
        // if (!isValidEmail(email)) {
        //     alert('Please enter a valid .tsu email address.');
        //     return;
        // }
        if (email && password && username) {
            try {
                // Create the user account
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
    
                // Send verification email
                await sendEmailVerification(user);
    
                // Store the username in Firebase Realtime Database
                const db = getDatabase();
                set(ref(db, 'UserInformation/' + user.uid), {
                    Username: username
                });
    
                // Navigate to VerificationPage after sending the email
                navigation.navigate("VerificationPage");
            } catch (err) {
                console.log('Error, ', err.message);
            }
        } else {
            alert("Fill in all fields");
        }
    };
    const isValidEmail = (email) => {
        return email.endsWith('.tsu.edu');
    };
    
    return (
        <SafeAreaView style={{flex:1, backgroundColor:"#191919", justifyContent:"center", alignItems:"center"}}>
        <KeyboardAvoidingView behavior='padding' style={{flex:1}}>
        {/* this is the equivalent of a div in html */}
            <View style={styles.container}>
                <MyLogo/>
                <View style={styles.inputParent}>
                    <MyInputText value={username} onChangeText={value=> setUsername(value)} style={styles.inputContainer} placeholder='Username...' placeholderTextColor={"#4c4c4c"}/>
                    <MyInputText value={email} onChangeText={value=> setEmail(value)} style={styles.inputContainer} placeholder='.edu e-mail...' placeholderTextColor={"#4c4c4c"}/>
                    <MyInputText value={password} onChangeText={value=> setPassword(value)} secureTextEntry style={styles.inputContainer} placeholder='Password...' placeholderTextColor={"#4c4c4c"}/>
                    <MyButton title="Sign Up" onPress={handleSignUp}/>
                </View>
            </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
      )
    }
    
    export default SignUp;
    
    const styles = StyleSheet.create({
        container:{
            backgroundColor:"#191919", 
            flex:1,
            justifyContent:"center",
            alignItems:"center"
        },
    })