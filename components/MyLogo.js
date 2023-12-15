import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import mainlogo from "../images/mainLogo.png"

const MyLogo = () => {
  return (
    <View>
      <Image source={mainlogo} style={styles.mainlogo}/>
    </View>
  )
}

export default MyLogo

const styles = StyleSheet.create({
    mainlogo:{
        height:250,
        width:250,
    },
})