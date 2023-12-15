import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, View, } from 'react-native'
import { Image } from 'react-native'
import React from 'react'
import mainlogo from "../images/mainLogo.png"
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native';
import 'firebase/compat/auth'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from '../database/firebaseConfig';
import { useState, useEffect } from 'react'
import { getDatabase, ref, update } from 'firebase/database';
import Ionicons from '@expo/vector-icons/Ionicons';
import MyInputText from '../components/MyInputText'
import MyLogo from '../components/MyLogo'
import MyButton from '../components/MyButton'
import MyDropdown from '../components/MyDropdown'
import MyCustomMultiSelect from '../components/MyCustomMultiSelect'
import { fetchMajors, fetchInterests, fetchCourses } from '../data/fetchData'

const InterestsPage = () => {
    const navigation=useNavigation();
    const [interestsData, setInterestsData] = useState([]);
    const [majorsData, setMajorsData] = useState([]);
    const [coursesData, setCoursesData] = useState([]);
    const [selectedMajor, setSelectedMajor] = useState(null);
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // const majors = [
    //     { label: 'Computer Science'},
    //     { label: 'Psychology'},
    //     { label: 'Mathematics'},
    //     { label: 'Electrical Engineering'},
    //     { label: 'English'},
    // ];
    // const interests = [
    //     { label: 'Data Science', value: 'Data Science'},
    //     { label: 'UI/UX', value: 'UI/UX'},
    //     { label: 'Web Design', value: 'Web Design'},
    //     { label: 'App Develppment', value: 'App Develppment'},
    //     { label: 'Writing', value: 'Writing'},
    //     { label: 'Machine Learning', value: 'Machine Learning'},
    //     { label: 'Public Speaking', value: 'Public Speaking'},
    //     { label: 'Theatre', value: 'Theatre'},
    //     { label: 'Videography', value: 'Videography'},
    //     { label: 'Cryptography', value: 'Cryptography'},
    // ];

    useEffect(() => {
        // Fetch interests
        const unsubscribeInterests = fetchInterests(
            (data) => {
                setInterestsData(data);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching interests: ", error);
                setError(error);
            }
        );

        // Fetch majors
        const unsubscribeMajors = fetchMajors(
            (data) => {
                setMajorsData(data);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching majors: ", error);
                setError(error);
            }
        );

        //fetch courses
        const unsubscribeCourses = fetchCourses(
            (data) => {
                setCoursesData(data);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching majors: ", error);
                setError(error);
            }
        );

        return () => {
            unsubscribeInterests();
            unsubscribeMajors();
            unsubscribeCourses();
        };
    }, []);

    const handleSelect = (item) => {
        console.log('Selected item:', item);
    };
    function updateUserInformation() {
        // Get the current user's UID from Firebase Authentication
        const user = getAuth().currentUser;
    
        if (user) {
            const db = getDatabase();
            const userRef = ref(db, 'UserInformation/' + user.uid);
    
            // Prepare the updates
            const updates = {};
            if (selectedMajor) updates['Major'] = selectedMajor.label;
            if (selectedInterests.length > 0) updates['Interests'] = selectedInterests;
            if (selectedCourses.length > 0) updates['Courses'] = selectedCourses;
    
            // Perform the update
            update(userRef, updates).then(() => {
                console.log('User information updated successfully.');
                navigation.navigate('WelcomePage'); // Navigate to the WelcomePage on success
            }).catch((error) => {
                console.error('Error updating user information:', error);
            });
        }
    }
  return (
    <SafeAreaView style={{flex:1, backgroundColor:"#191919", justifyContent:"center", alignItems:"center"}}>
        <KeyboardAvoidingView>
            <View style={styles.container}>
                <MyLogo/>
                <View>
                    
                    <MyDropdown
                        title={"Major"}
                        placeholder="Select a major..."
                        data={majorsData}
                        onSelect={(item) => setSelectedMajor(item)}
                    />
                    
                    <MyCustomMultiSelect
                        title={"Interests"}
                        data={interestsData}
                        max={4}
                        onSelect={(items) => setSelectedInterests(items)}
                    />
                    <MyCustomMultiSelect
                        title={"Courses"}
                        data={coursesData}
                        max={6}
                        onSelect={(items) => setSelectedCourses(items)}
                    />
                    <MyButton title="Next"
                        onPress={updateUserInformation}
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default InterestsPage

const styles = StyleSheet.create({
    container:{
        justifyContent:"center",
        alignItems:"center"
    },
    
})