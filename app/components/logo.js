import { View, Image} from "react-native";
import { Text } from "react-native-paper";

export function Logo() {
  return (
    <View style = {{justifyContent: 'center', alignItems: 'center'}}>
      <Image source={require('./MOMA.png')} resizeMode="contain" style={{ width: 250, height: 100, }}/>
    </View>
  )
}