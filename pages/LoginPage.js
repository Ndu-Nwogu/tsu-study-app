import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, View, } from 'react-native'
import React from 'react'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native';
import 'firebase/compat/auth'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../database/firebaseConfig';
import { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import MyInputText from '../components/MyInputText'
import MyButton from '../components/MyButton'
import MyLogo from '../components/MyLogo'



const LoginPage = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const handleLogin = async()=>{
    if(email && password){
      try{
        await signInWithEmailAndPassword(auth, email, password);
        navigation.navigate("MainPage")
      } catch(err){
        alert('User not found');
      }
    }
    else{
        alert("Fill empty feilds")
    }
}
function handleSignUp(){
    navigation.navigate('SignUp')
  }


  return (
    <SafeAreaView style={{flex:1, backgroundColor:"#191919"}}>
    <KeyboardAvoidingView behavior='padding' style={{flex:1}}>
    {/* this is the equivalent of a div in html */}
        <View style={styles.container}>
            <MyLogo/>
            <View style={styles.inputParent}>
                <MyInputText value={email} onChangeText={setEmail} style={styles.inputContainer} placeholder='.edu e-mail...' placeholderTextColor={"#4c4c4c"}/>
                <MyInputText value={password} onChangeText={setPassword} secureTextEntry style={styles.inputContainer} placeholder='Password...' placeholderTextColor={"#4c4c4c"}/>
                <TouchableOpacity activeOpacity={1}>
                    <Text style={{alignSelf:"center", textDecorationLine:true, color:"#7C183E", fontSize:16, marginVertical:10}}>Forgot Password?</Text>
                </TouchableOpacity>
                <MyButton title="Login" onPress={handleLogin}/>
            </View>
            <TouchableOpacity activeOpacity={1} style={{marginTop:100}} onPress={handleSignUp}>
                <Text style={{color:"white"}}>Don't have an account?
                <Text style={{color:"#FFD700", textDecorationLine:true}}>Sign Up</Text>
                </Text>
            </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default LoginPage;

const styles = StyleSheet.create({
    container:{
        justifyContent:"center",
        alignItems:"center"
    },
})