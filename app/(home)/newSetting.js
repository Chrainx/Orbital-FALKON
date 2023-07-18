import { SafeAreaView, View, Text, TextInput, Button, TouchableOpacity} from 'react-native';
export const NewSetting = props => {
  return (
    <View>
      <TouchableOpacity
        style = {{
          flexDirection: 'row',
          backgroundColor: '#73a0b9',
          borderRadius: 10,
          justifyContent: props.icon? 'space-between': 'flex-start',
          alignItems: 'center',
          marginHorizontal: 6,
          marginVertical: 2,
          padding: 20,
        }}
        onPress= {props.action}
      >
      <Text style = {{color: props.isDestructive? '#ff0000' : 'white', fontWeight: 800, fontSize: 17}}> {props.title} </Text>
      {props.icon && <View>{props.icon}</View>}
      </TouchableOpacity>

    </View>
  );
}