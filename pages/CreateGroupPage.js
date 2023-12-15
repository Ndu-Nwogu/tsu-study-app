// CreateGroupScreen.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Picker, StyleSheet, Text } from 'react-native';
import { getDatabase, ref, set, push, update, get, runTransaction } from 'firebase/database';
import MyCustomMultiSelect from '../components/MyCustomMultiSelect';
import { ActivityIndicator } from 'react-native';
import MyDropdown from '../components/MyDropdown';
import MyInputText from '../components/MyInputText';
import MyButton from '../components/MyButton';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';


const CreateGroupScreen = () => {
    const navigation = useNavigation();
    const [groupName, setGroupName] = useState('');
    const [selectedMajor, setSelectedMajor] = useState(null);
    const [majorsData, setMajorsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const db = getDatabase();

    useEffect(() => {
        // Fetch majors from the database and update the 'majorsData' state
        const majorsRef = ref(db, 'Majors');
        get(majorsRef).then((snapshot) => {
            const majors = snapshot.val();
            const fetchedMajors = Object.keys(majors).map((key) => ({
                label: majors[key].MajorName,
                value: key,
            }));
            setMajorsData(fetchedMajors);
            setLoading(false);
        }).catch((error) => {
            console.error('Error fetching majors:', error);
            setLoading(false);
        });
    }, []);

    const handleCreateGroup = () => {
        // Ensure a major is selected
        if (!selectedMajor) {
            alert('Please select a major for the group.');
            return;
        }

        const db = getDatabase();
        const currentUser = getAuth().currentUser;
    if (!currentUser) {
        alert('No user is signed in.');
        return;
    }

    // Create the group with selected major in the database
    const groupsRef = ref(db, 'Groups');
    const newGroupRef = push(groupsRef); // Create a new reference for a group entry
    set(newGroupRef, {
        name: groupName,
        members: {
            [currentUser.uid]: true
        },
        creator: currentUser.uid, // Add the group creator's UID
        messages: {} // Initialize an empty messages object
    }).then(() => {
        // Update the major's NumOfGroups
        const majorRef = ref(db, `Majors/${selectedMajor.value}`);
        runTransaction(majorRef, (currentData) => {
            if (currentData) {
                if ('NumOfGroups' in currentData) {
                    currentData.NumOfGroups++;
                } else {
                    currentData.NumOfGroups = 1;
                }
            }
            return currentData;
        });

        // Navigate back to the main page
        navigation.goBack(); // or navigation.navigate('MainPage');
    }).catch((error) => {
        console.error('Error creating group:', error);
    });
    };

    if (loading) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:"#191919" }}>
            <MyInputText
                value={groupName}
                onChangeText={setGroupName}
                placeholder="Enter Group Name"
                style={styles.inputText}
            />
            <MyDropdown
                data={majorsData}
                onSelect={(items) => {
                    // Assuming MyCustomMultiSelect is designed to handle multiple selections,
                    // we only take the first selection for the group's major
                    setSelectedMajor(items);
                }}
                max={1} // Set to 1 to allow only one major to be selected
                title="Select Major"
            />
            <MyButton title={"Create Group"} onPress={handleCreateGroup}/>
        </View>
    );
};

const styles = StyleSheet.create({
    
});

export default CreateGroupScreen;
