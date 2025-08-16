import { Slot, Stack } from "expo-router";
import { Platform, SafeAreaView, StatusBar, StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <SafeAreaView style={styles.container}>
      <Slot/>
    </SafeAreaView>
  )
}


const styles=StyleSheet.create({
  container:{
    flex:1,
    marginTop:Platform.OS==='android'?StatusBar.currentHeight:0,
    backgroundColor:"#F5EFE0"
  }
})