import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MyLogo from '../components/MyLogo'
import MyButton from '../components/MyButton'
import { useNavigation } from '@react-navigation/native';


const WelcomePage = () => {
    const navigation=useNavigation();
    function handleMain(){
        navigation.navigate("MainPage")
    }
  return (
    <SafeAreaView style={{flex:1, backgroundColor:"#191919", justifyContent:"center", alignItems:"center"}}>
        <View style={{alignItems:"center", justifyContent:"center"}}>
        <MyLogo/>
        <Text style={{alignSelf:"center", marginBottom:15, fontSize:24, color:"#B7B7B7"}}>Welcome to the TSU Study App</Text>
        <Text style={{alignSelf:"center", marginBottom:50, fontSize:18, color:"#B7B7B7"}}>Have a Great Time</Text>
        <MyButton
            title="Finish"
            onPress={handleMain}
        />
        </View>
    </SafeAreaView>
  )
}

export default WelcomePage

const styles = StyleSheet.create({})