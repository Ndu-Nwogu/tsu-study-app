import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react';
import 'firebase/compat/auth'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from '../database/firebaseConfig';
import { getDatabase, ref, set,onValue,off } from 'firebase/database';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GroupPage from './GroupPage';
import DiscoverPage from './DiscoverPage';
import ProfilePage from './ProfilePage';

const Tab = createBottomTabNavigator();

const MainPage = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Groups') {
            iconName = focused ? 'ios-school' : 'ios-school-outline'; // Change the icon for Groups
          } else if (route.name === 'Discover') {
            iconName = focused ? 'ios-search' : 'ios-search-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'ios-person' : 'ios-person-outline'; // Add icon for Profile
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: '#0D0D0D',
          borderTopWidth: 0,
          borderColor: 'transparent',
          padding:10
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Groups" component={GroupPage} options={{ headerShown: false, gestureEnabled: false }} />
      <Tab.Screen name="Discover" component={DiscoverPage} options={{ headerShown: false, gestureEnabled: false }} />
      <Tab.Screen name="Profile" component={ProfilePage} options={{ headerShown: false, gestureEnabled: false }} />

    </Tab.Navigator>
  );
  
};


export default MainPage;
const styles = StyleSheet.create({
  tabItems:{
    backgroundColor:"#0D0D0D"
  }
});