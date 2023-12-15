import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, off, get, set } from 'firebase/database';
import { ActivityIndicator } from 'react-native';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
const DiscoverPage = () => {


  const majorColors = {
    "Computer Science": "#8411CB",
    "Psychology": "#2199BF",
    "Mathematics": "#CB113E",
    "Electrical Engineering": "#2565E1",
    "English": "tomato",
  };

  const navigation = useNavigation();
  const [currentUserProfile, setCurrentUserProfile] = useState({});
  const [similarStudents, setSimilarStudents] = useState([]);
  const [loadingSimilarStudents, setLoadingSimilarStudents] = useState(true);
  const [groupsForUser, setGroupsForUser] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(true);

  const db = getDatabase();
  const currentUser = getAuth().currentUser;


  useEffect(() => {
    const majorsRef = ref(db, 'Majors');
    onValue(majorsRef, (snapshot) => {
      const majorsData = snapshot.val();
      const majorsList = Object.keys(majorsData).map(key => ({
        id: key,
        name: majorsData[key].MajorName,
        numOfGroups: majorsData[key].NumOfGroups || 0,
      }));
      setMajors(majorsList);
      setLoading(false);
    });

    return () => off(majorsRef);
  }, []);

  useEffect(() => {
    // Fetch the current user's profile information
    if (currentUser) {
      const userProfileRef = ref(db, `UserInformation/${currentUser.uid}`);
      get(userProfileRef).then((profileSnapshot) => {
        if (profileSnapshot.exists()) {
          const profile = profileSnapshot.val();
          setCurrentUserProfile(profile);
        }
        setLoading(false);
      });
    }
  }, [currentUser]);

  // for students lke you
  useEffect(() => {
    if (!loading && currentUserProfile) {
      const usersRef = ref(db, 'UserInformation');
      get(usersRef).then((usersSnapshot) => {
        const usersData = usersSnapshot.val();
        const usersList = Object.keys(usersData)
          .filter(key => key !== currentUser.uid) // Exclude the current user
          .map(key => usersData[key])
          .filter(user => 
            user.major === currentUserProfile.major ||
            (user.courses && currentUserProfile.courses && user.courses.some(course => currentUserProfile.courses.includes(course))) ||
            (user.interests && currentUserProfile.interests && user.interests.some(interest => currentUserProfile.interests.includes(interest)))
          );
        setSimilarStudents(usersList);
        setLoadingSimilarStudents(false);
      });
    }
  }, [loading, currentUserProfile]);

  // for groups
  useEffect(() => {
    if (!loading && currentUserProfile) {
      // Fetch groups based on the current user's major
      const groupsRef = ref(db, 'Groups');
      onValue(groupsRef, (snapshot) => {
        const groupsData = snapshot.val();
        const groupsList = groupsData ? Object.keys(groupsData).map(key => {
          const groupMembers = groupsData[key].members || {};
          const memberCount = Object.keys(groupMembers).length;
          return {
            id: key,
            name: groupsData[key].name,
            memberCount: memberCount,
            isUserMember: groupMembers.hasOwnProperty(currentUser.uid), // Check if the user is a member
          };
        }).filter(group => group.major === currentUserProfile.major && !group.isUserMember) : []; // Filter out groups the user is in
        setGroupsForUser(groupsList);
        setLoadingGroups(false);
      });
  
      return () => off(groupsRef);
    }
  }, [loading, currentUserProfile, currentUser]);
  

  const handleJoinGroup = (group) => {
    if (group.members && group.members[currentUser.uid]) {
      // User is already a member of this group
      alert("You are already a member of this group.");
      return;
    }

    // Add the user to the group's members list in the database
    const groupMembersRef = ref(db, `Groups/${group.id}/members/${currentUser.uid}`);
    set(groupMembersRef, true).then(() => {
      // Success
      alert("You have joined the group successfully!");
      // Update the state to reflect the change locally
      setGroupsForUser(prevGroups => prevGroups.map(g => {
        if (g.id === group.id) {
          return { ...g, members: { ...(g.members || {}), [currentUser.uid]: true } };
        }
        return g;
      }));
    }).catch((error) => {
      // Error
      console.error("Error joining group: ", error);
      alert("There was an error joining the group.");
    });
  };
  return (
    <SafeAreaView style={{ flex: 1,backgroundColor:"#191919" }}>
      <View style={{padding:20, flexDirection:"row", justifyContent:"space-between"}}>
          <Text style={{color:"white", fontSize:24, fontWeight:"500"}}>Discover</Text>
        </View>
      <ScrollView>
        <Text style={styles.header}>Majors</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingLeft:20}}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              majors.map(major => (
                
                  <View key={major.id} style={[styles.majorItem, { backgroundColor: majorColors[major.name] || '#2565E1' }]}>
                    <Text style={styles.majorName}>{major.name}</Text>
                    <Text style={styles.majorCount}>{major.numOfGroups} Group(s)</Text>
                  </View>
                
              ))
            )}
      </ScrollView>
      <Text style={styles.header}>Students like you</Text>
      <ScrollView horizontal style={styles.studentCard} >
        {loadingSimilarStudents ? (
          <ActivityIndicator />
        ) : (
          similarStudents.map((student, index) => (
            <View  key={index} style={{justifyContent:"center", alignItems:"center", padding:10}} >
              <View style={styles.studentImage}></View>
              <Text style={styles.studentName}>{student.Username}</Text>
            </View>
          ))
        )}
        </ScrollView>
        {/* for groups */}
        <Text style={styles.header}>Groups for you</Text>
        <View style={{alignItems:"center", justifyContent:"center"}}>
          {loadingGroups ? (
            <ActivityIndicator />
          ) : (
            groupsForUser.length > 0 ? (
              groupsForUser.map((group, index) => (
                <View key={index} style={styles.groupCard}>
                  <View style={styles.groupImage}></View>
                  <Text style={styles.groupName}>{group.name}</Text>
                  <TouchableOpacity activeOpacity={0.8} style={styles.joinButton} onPress={handleJoinGroup}>
                    <Text style={{color:"white"}}>Join</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.noGroupsText}>No groups found for your major.</Text>
            )
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default DiscoverPage

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    color: 'white',
    fontWeight: '500',
    margin:10,
    marginLeft:20,
  },
  majorItem: {
    width:200,
    height:120,
    backgroundColor:"tomato",
    margin:10,
    borderRadius:5,
    padding:10,
    justifyContent:"center",
    
  },
  majorName: {
    fontSize:16,
    color:"white",
    marginBottom:5
  },
  majorCount: {
    fontSize:16,
    color:"#C2C2C2",
  },
  studentName: {
    color: 'white',
    
  },
  studentCard:{
    paddingLeft:10,
  },
  studentImage:{
    backgroundColor: 'black',
    width:100,
    height:100,
    borderRadius: 50,
    marginBottom:10
  },
  groupCard: {
      width:350,
      height:70,
      backgroundColor:"#272727",
      marginVertical:10,
      borderRadius:15,
      padding:10,
      flexDirection:"row",
      alignItems:"center",
      paddingLeft:10
  },
  groupName: {
    color:"#BCBABA",
    marginLeft:10
  },
  noGroupsText: {
    color: 'grey',
    textAlign: 'center',
    padding: 20,
  },
  groupImage:{
    width:50,
    height:50,
    borderWidth:1,
    borderRadius:100,
    backgroundColor:"black"
  },
  joinButton:{
    width: 70,
    height:35,
    borderWidth:1,
    borderColor:"#6F6F6F",
    borderRadius:50,
    alignItems:"center",
    justifyContent:"center",
    marginLeft:110
  }
  
});
