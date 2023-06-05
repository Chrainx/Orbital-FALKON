import { View } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Logo } from "../components/logo";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [errEmailMsg, setErrEmailMsg] = useState('');
  const [errPasswordMsg, setErrPasswordMsg] = useState('');

  const handleRegister = async () => {
    setErrEmailMsg("");
    setErrPasswordMsg("");
    setErrMsg("");
    if (email == "") {
      setErrEmailMsg("Email cannot be empty!");
      if (password == "") {
        setErrPasswordMsg("Password cannot be empty!");
      }
      return;
    }
    if (password == "") {
      setErrPasswordMsg("Password cannot be empty!");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) { 
      setErrMsg(error.message + "!");
      return;
    }
  }
  return (
    <SafeAreaView style = {{flex: 1, alignItems: 'center'}}>
      <Text> Register Page </Text>
      <View style = {{flex: 1, justifyContent: 'center', width: 300}}>
        <Logo />
        <Text> Email </Text>
        <TextInput 
          autoCapitalize="none"
          textContentType="emailAddress"
          value={email}
          onChangeText={setEmail} />
          {errEmailMsg !== "" && <Text style = {{color:'red'}}>{errEmailMsg} </Text>}
        <Text> Password </Text>
        <TextInput
          secureTextEntry
          autoCapitalize="none"
          textContentType="password"
          value={password}
          onChangeText={setPassword} />
          {errPasswordMsg !== "" && <Text style = {{color:'red'}}>{errPasswordMsg} </Text>}
        <Button onPress = {handleRegister}> Register </Button>
        {errMsg !== "" && <Text style = {{color:'red'}}> {errMsg} </Text>}
        {loading && <ActivityIndicator />}
      </View>
    </SafeAreaView>
  )
}