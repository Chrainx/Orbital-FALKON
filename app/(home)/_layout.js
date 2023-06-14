import React from 'react';
import { Tabs } from "expo-router";
import { View, Image, TouchableOpacity, StyleSheet} from "react-native";

export default function AuthLayout() {
  return <Tabs
      style = {style.tabs}
      screenOptions={
        {
          headerTitle: () => (
            <Image source={require('./tab-icons/MOMA.png')} 
                  resizeMode="contain" 
                  style={{ width: 100, height: 30, }}/>
                  ),
          headerStyle: {backgroundColor: "#DAF7A6"}
        }
      }
    >
    <Tabs.Screen name = "expense" options = {{
      tabBarIcon: ({focused}) => (
        <Image 
        source={require('./tab-icons/expense.png')}
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
          source={require('./tab-icons/bar-chart.png')}
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
        source={require('./tab-icons/add.png')}
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
        source={require('./tab-icons/setting.png')}
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