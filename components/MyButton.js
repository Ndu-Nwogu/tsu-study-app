import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const MyButton = ({ title, onPress }) => {
  return (
    <View>
      <TouchableOpacity activeOpacity={0.8} style={styles.btnStyle} onPress={onPress}>
            <Text style={styles.textStyle}>{title}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default MyButton

const styles = StyleSheet.create({
    btnStyle:{
        width:350,
        height:55,
        backgroundColor:"#7C183E",
        borderRadius:15,
        alignItems:"center",
        justifyContent:"center",
        marginVertical:10
    },
    textStyle:{
        color:"white", 
        fontSize:20, 
        fontWeight:"500"
    }
})