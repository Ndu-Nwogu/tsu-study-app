import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler'

const MyInputText = ({ value, onChangeText, placeholder, style, secureTextEntry }) => {
  return (
    <View>
      <TextInput style={styles.inputContainer} placeholderTextColor={"#4c4c4c"} placeholder={placeholder} onChangeText={onChangeText} secureTextEntry={secureTextEntry} value={value}/>
    </View>
  )
}

export default MyInputText

const styles = StyleSheet.create({
    inputContainer:{
        width:350,
        height:55,
        borderWidth:1,
        borderRadius:15,
        marginVertical:10,
        color:"#B7B7B7",
        borderColor:"#4C4C4C",
        paddingLeft:20,
        fontSize:15
    },
})