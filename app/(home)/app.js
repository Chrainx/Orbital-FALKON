import React from 'react';
import { useAuth } from "../../contexts/auth";
import { Text, View, Image, TouchableOpacity, StyleSheet} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Home from './home';
import Category from './category';


export default function App() {

  const Stack = createNativeStackNavigator();

  return (
      <Stack.Navigator>
        <Stack.Screen
          name='Home'
          component={Home}
          options= {{headerShown: false}}
        />
        <Stack.Screen
          name='Category'
          component={Category}
        />
      </Stack.Navigator>
  );
}

const style = StyleSheet.create({
  tabs: {
    height: 10,

  },
})