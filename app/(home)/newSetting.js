import { SafeAreaView, View, Text, TextInput, Button, TouchableOpacity} from 'react-native';
export const NewSetting = props => {
  return (
    <View>
      <TouchableOpacity
        style = {{
          flexDirection: 'row',
          backgroundColor: 'black',
          borderRadius: 10,
          justifyContent: props.icon? 'space-between': 'flex-start',
          alignItems: 'center',
          marginHorizontal: 6,
          marginVertical: 2,
          padding: 20,
        }}
        onPress= {props.action}
      >
      <Text style = {{color: props.isDestructive? 'red' : 'white' }}> {props.title} </Text>
      {props.icon && <View>{props.icon}</View>}
      </TouchableOpacity>
      {props.detail}

    </View>
  );
}