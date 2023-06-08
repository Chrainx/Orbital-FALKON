import React from 'react';
import { Tabs } from "expo-router";
import { View, Image, TouchableOpacity, StyleSheet} from "react-native";

export default function AuthLayout() {
  return <Tabs
      style = {style.tabs}
      screenOptions={
        {
          headerTitle: "Moma",
          // headerBackground: add the logo
          headerStyle: {backgroundColor: "yellow"}
        }
      }
    >
    <Tabs.Screen name = "expense" options = {{
      tabBarIcon: ({focused}) => (
        <Image 
        source={require('./expense.png')}
        resizeMode="contain"
        style={{
          width: 25,
          height: 25,
          }}/>
        ), 
        tabBarLabel: "Expense"
        
        }}/>
    
    <Tabs.Screen 
      name = "report" 
      options = {{
        tabBarIcon: ({focused}) => (
          <Image 
          source={require('./bar-chart.png')}
          resizeMode="contain"
          style={{
            width: 25,
            height: 25,
          }}/>
        ), 
        tabBarLabel: "Report"
        
        }}/>


    <Tabs.Screen name = "add" options = {{
      tabBarIcon: ({focused}) => (
        <Image 
        source={require('./add.png')}
        resizeMode="contain"
        style={{
          width: 25,
          height: 25,
          }}/>
        ), 
        tabBarLabel: "Add"

        }}/>

    <Tabs.Screen name = "setting" options = {{
      tabBarIcon: ({focused}) => (
        <Image 
        source={require('./setting.png')}
        resizeMode="contain"
        style={{
          width: 25,
          height: 25,
          }}/>
        ), 
        tabBarLabel: "Settings"
    }}/>
  </Tabs>;


}

const style = StyleSheet.create({
  tabs: {
    height: 10,

  },
})