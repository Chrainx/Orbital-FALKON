import { SafeAreaView, View, Text, TextInput, Button, TouchableOpacity} from 'react-native';
export const NewItem = props => {
  return (
    <TouchableOpacity
      style = {{
        flexDirection: 'row',
        backgroundColor: 'black',
        justifyContent: props.detail? 'space-between': 'flex-start',
        alignItems: 'center',
        marginBottom: 1,
        width: '100%',
        padding: 20,
        borderBottomWidth: 3,
      }}
      onPress= {props.action}
    >
      <Text style = {{color: props.isDestructive? 'red' : 'white' }}> {props.title} </Text>
      {props.detail && <View>{props.detail}</View>}
    </TouchableOpacity>
  );
}