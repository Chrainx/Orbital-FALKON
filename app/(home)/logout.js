import { Button } from "react-native-paper";
import { View } from "react-native";
import { supabase } from "../../lib/supabase";

export default function ProfileScreen() {
  return (
    <View style= {{flex: 1, justifyContent: 'center', alignItems:'center'}}>
      <Button onPress={() => supabase.auth.signOut()}> Logout</Button> 
    </View>
  );
}