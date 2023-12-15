import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-ionicons'
import useAuth from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import SignUp from './pages/SignUp';
import MainPage from './pages/MainPage';
import VerificationPage from './pages/VerificationPage';
import InterestsPage from './pages/InterestsPage';
import WelcomePage from './pages/WelcomePage';
import GroupChat from './tabs/GroupChat';
import DiscoverPage from './pages/DiscoverPage';
import CreateGroupPage from './pages/CreateGroupPage';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signOut, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from 'react';
import ProfilePage from './pages/ProfilePage';


const Stack = createStackNavigator()

export default function App() {
  
  const auth = getAuth();
  const [initializing, setInitializing] = useState(true);
  const {user} = useAuth();
  const [isPostAuthComplete, setIsPostAuthComplete] = useState(false);


  
  
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name= 'Login' component={LoginPage} options={{ headerShown:false, gestureEnabled:false}}/>
      <Stack.Screen name= 'SignUp' component={SignUp} options={{ headerShown:false, gestureEnabled:false}}/>
      <Stack.Screen name= 'VerificationPage' component={VerificationPage} options={{ headerShown:false, gestureEnabled:false}}/>
      <Stack.Screen name= 'InterestsPage' component={InterestsPage} options={{ headerShown:false, gestureEnabled:false}}/>
      <Stack.Screen name= 'WelcomePage' component={WelcomePage} options={{ headerShown:false, gestureEnabled:false}}/>
      <Stack.Screen name = 'MainPage' component={MainPage} options={{ headerShown:false, gestureEnabled:false}} />
      <Stack.Screen name= 'GroupChat' component={GroupChat} options={{ headerShown:false, gestureEnabled:true}}/>
      <Stack.Screen name= 'DiscoverPage' component={DiscoverPage} options={{ headerShown:false, gestureEnabled:true}}/>
      <Stack.Screen name= 'CreateGroupPage' component={CreateGroupPage} options={{ headerShown:false, gestureEnabled:true}}/>
    </Stack.Navigator>
    </NavigationContainer>
  );
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
