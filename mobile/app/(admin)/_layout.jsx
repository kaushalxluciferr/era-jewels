import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {Tabs} from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
const AdminLayout = () => {
  return (
   <Tabs screenOptions={{headerShown:false}}>
    <Tabs.Screen name='index' options={{title:"Add Product", tabBarIcon:({color,size})=><Ionicons name='add-outline' size={size} color={color}/>}}/>
    <Tabs.Screen name='productList' options={{title:"All Product", tabBarIcon:({color,size})=><Ionicons name='bag-outline' size={size} color={color}/>}}/>
    <Tabs.Screen name='order' options={{title:"All order", tabBarIcon:({color,size})=><Ionicons name='receipt-outline' size={size} color={color}/>}}/>
    <Tabs.Screen name='addCategory' options={{title:"Add Category", tabBarIcon:({color,size})=><Ionicons name='add-outline' size={size} color={color}/>}}/>
    <Tabs.Screen name='OrderDetail' options={{href:null}}/>
   </Tabs>
  )
}

export default AdminLayout

const styles = StyleSheet.create({})