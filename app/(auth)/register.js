import { View, StyleSheet } from "react-native";
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
      setErrMsg(error.message);
      return;
    }
    setErrMsg("Confirmation has been sent to your email");
  }
  return (
    <SafeAreaView style = {{flex: 1, alignItems: 'center', }}>
      <View style = {{flex: 1, justifyContent: 'center', width: 300}}>
        <Logo />
        <Text></Text>
        <Text style={{fontSize: 18, fontWeight:600}}> Email </Text>
        <TextInput 
          style = {style.input}
          placeholder = 'Enter your email here'
          mode = 'outlined'
          autoCapitalize="none"
          textContentType="emailAddress"
          value={email}
          onChangeText={setEmail} />
          {errEmailMsg !== "" && <Text style = {style.error}>{errEmailMsg} </Text>}
        <Text style = {{fontSize: 18, fontWeight: 600, marginTop: 20}}> Password </Text>
        <TextInput
          style = {style.input}
          placeholder = 'Enter your password here'
          mode = 'outlined'
          secureTextEntry
          autoCapitalize="none"
          textContentType="password"
          value={password}
          onChangeText={setPassword} />
          {errPasswordMsg !== "" && <Text style = {style.error}>{errPasswordMsg} </Text>}
        <Button 
        style={{marginVertical: '6%', backgroundColor: '#368ce7'}}
        onPress = {handleRegister}><Text style= {{fontWeight: 800, color: 'white', }}>REGISTER</Text></Button>
        {errMsg !== "" && <Text style = {style.error}>{errMsg}</Text>}
        {loading && <ActivityIndicator />}
      </View>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  input: {
    marginBottom: '2%'
  },

  text: {
    marginTop: 10
  },

  error: {
    color: 'red',
    left: 3,
    fontSize: 15,
    fontWeight: 600,
    marginVertical: '3%',
    textAlign: 'center',
  },
})