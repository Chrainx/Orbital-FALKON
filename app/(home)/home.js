import React from 'react';
import { useAuth } from "../../contexts/auth";
import { Text, View, Image, TouchableOpacity, StyleSheet} from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Expense from './expense';
import Setting from './setting';
import Report from './report';
import Add from './add';
import Category from './category';

export default function Home() {

  const Tab = createBottomTabNavigator();

  return (
      <Tab.Navigator>
        <Tab.Screen 
          name="Expense" 
          component={Expense} 
          options = {{
            tabBarIcon: ({focused}) => (
              <Image 
                source={require('./tab-icons/expense.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                }}/>
            )
          }}
        />
        <Tab.Screen 
          name="Report" 
          component={Report} 
          options = {{
            tabBarIcon: ({focused}) => (
              <Image 
                source={require('./tab-icons/bar-chart.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                }}/>
            )
          }}
        />
        <Tab.Screen 
          name="Add" 
          component={Add} 
          options = {{
            tabBarIcon: ({focused}) => (
              <Image 
                source={require('./tab-icons/add.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                }}/>
            )
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={Setting} 
          options = {{
            tabBarIcon: ({focused}) => (
              <Image 
                source={require('./tab-icons/setting.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                }}/>
            )
          }}
        />
      </Tab.Navigator>
  );
}

const style = StyleSheet.create({
  tabs: {
    height: 10,

  },
})