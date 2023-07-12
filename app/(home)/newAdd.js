import { SafeAreaView, View, Text, TextInput, Button, TouchableOpacity} from 'react-native';
export const NewAdd = props => {
  return (
    <View>
      <TouchableOpacity
        style = {{
          flexDirection: 'row',
          backgroundColor: '#73a0b9',
          //backgroundColor: '#1D79D0',
          borderRadius: 10,
          justifyContent: props.icon? 'space-between': 'flex-start',
          alignItems: 'center',
          marginHorizontal: 6,
          marginVertical: 2,
          //width: '100%',
          padding: 20,
        }}
        onPress= {props.action}
      >
      <Text style = {{color: props.isDestructive? 'red' : 'white' , fontWeight: 800, fontSize: 17}}> {props.title} </Text>
      {props.icon && <View>{props.icon}</View>}
      </TouchableOpacity>
      {props.detail}

    </View>
  );
}