import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, off, get, set } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MyButton from '../components/MyButton';

const ProfilePage = () => {
    const navigation = useNavigation();
    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth)
          .then(() => {
            navigation.navigate('Login'); 
          })
          .catch((error) => {
            // An error happened
            console.error('Error signing out: ', error);
          });
      };
  return (
    <SafeAreaView style={{ flex: 1,backgroundColor:"#191919", alignItems:"center", justifyContent:"center" }}>
        <View>
            <MyButton
                title={"Logout"}
                onPress={handleLogout}
            />
        </View>
    </SafeAreaView>
  )
}

export default ProfilePage

const styles = StyleSheet.create({})