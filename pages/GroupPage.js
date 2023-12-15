import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react';
import 'firebase/compat/auth'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from '../database/firebaseConfig';
import { getDatabase, ref, set,onValue,off } from 'firebase/database';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const GroupPage = () => {
    const navigation = useNavigation();
    function handleCreate(){
        navigation.navigate("CreateGroupPage")
    }

    const [userGroups, setUserGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = getAuth().currentUser;
    console.log("active user:",user.email)
    
    useEffect(() => {
      if (user) {
        const db = getDatabase();
        const groupsRef = ref(db, 'Groups');
        onValue(groupsRef, (snapshot) => {
          const groupsSnapshot = snapshot.val();
          const userGroups = [];
          for (const groupId in groupsSnapshot) {
            if (groupsSnapshot[groupId].members && groupsSnapshot[groupId].members[user.uid]) {
              userGroups.push({
                id: groupId,
                ...groupsSnapshot[groupId],
              });
            }
          }
          setUserGroups(userGroups);
          setLoading(false);
        });
  
        
        return () => off(groupsRef);
      }
    }, [user]);
  
    return (
      <SafeAreaView style={{flex:1, backgroundColor:"#191919"}}>
        <View style={{padding:20, flexDirection:"row", justifyContent:"space-between"}}>
          <Text style={{color:"white", fontSize:24, fontWeight:"500"}}>Groups</Text>
          <TouchableOpacity onPress={handleCreate} activeOpacity={0.8}>
              <Ionicons name='ios-add' size={32} color={"#FFD700"}/>
          </TouchableOpacity>
        </View>
        <ScrollView>
        <View style={styles.groupContainer}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          userGroups.map(group => (
            <TouchableOpacity
              key={group.id}
              style={styles.groupItem}
              onPress={() => navigation.navigate('GroupChat', { groupId: group.id })}
            >
            <View style={styles.groupImage}></View>
              <Text style={styles.groupName}>{group.name} </Text>
            </TouchableOpacity>
          ))
        )}
      </View>
      </ScrollView>
      </SafeAreaView>
    )
}

export default GroupPage

const styles = StyleSheet.create({
    groupContainer:{
        alignItems:"center",
        justifyContent:"center"
      },
      groupItem:{
        width:350,
        height:70,
        backgroundColor:"#272727",
        marginVertical:10,
        borderRadius:15,
        padding:10,
        flexDirection:"row",
        alignItems:"center"
      },
      groupName:{
        color:"#BCBABA",
        marginLeft:10
      },
      groupImage:{
        width:50,
        height:50,
        borderWidth:1,
        borderRadius:100,
        backgroundColor:"black"
      }
})