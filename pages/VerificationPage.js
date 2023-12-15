import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react';
import { auth } from '../database/firebaseConfig';
import mainlogo from "../images/mainLogo.png"
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';
import MyLogo from '../components/MyLogo';


const VerificationPage = () => {
  const navigation = useNavigation();
  const [waitingForVerification, setWaitingForVerification] = useState(true);
  
    useEffect(() => {
        const interval = setInterval(() => {
            auth.currentUser.reload().then(() => {
                if (auth.currentUser.emailVerified) {
                    clearInterval(interval);
                    setWaitingForVerification(false);
                    // Navigate to the next page after verification
                    navigation.navigate("InterestsPage");
                }
            });
        }, 3000); // checks every 3 seconds

        return () => clearInterval(interval);
    }, []);

    if (waitingForVerification) {
        return(
          <SafeAreaView style={{flex:1, backgroundColor:"#191919", justifyContent:"center", alignItems:"center"}}>
            <View>
              <MyLogo/>
              <Text style={{color:"#B7B7B7", fontSize:15}}>Please Check your email for verification</Text>
            </View>
          </SafeAreaView>
        );
    }

    // Render something else or navigate away once verified
    return (
      <SafeAreaView style={{flex:1, backgroundColor:"#191919", justifyContent:"center", alignItems:"center"}}>
            <View>
              <MyLogo/>
              <Text style={{color:"#B7B7B7", fontSize:15, alignSelf:"center"}}>E-mail verified redirecting...</Text>
            </View>
          </SafeAreaView>
    )
}

export default VerificationPage

const styles = StyleSheet.create({
  mainlogoContainer:{
    alignItems:"center",
    justifyContent:"center"
},
mainlogo:{
    height:250,
    width:250,
},
})