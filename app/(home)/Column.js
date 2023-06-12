import { View } from "react-native"
import { Text } from 'react-native-paper'

export const Column = props => {
  return (
    <View style = {{flexDirection: 'row'}}>
      <Text> {props.title} </Text>
      {
        props.icon 
        ? <Text> ^ </Text> 
        : <Text> v </Text>
      }
    </View>
  )
}