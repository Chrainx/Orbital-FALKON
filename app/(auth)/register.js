import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Logo } from "../components/logo";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [errEmailMsg, setErrEmailMsg] = useState('');
  const [errPasswordMsg, setErrPasswordMsg] = useState('');
  const [errPasswordMsg2, setErrPasswordMsg2] = useState('');

  const handleRegister = async () => {
    setErrEmailMsg("");
    setErrPasswordMsg("");
    setErrPasswordMsg2("");
    setErrMsg("");
    if (email == "") {
      setErrEmailMsg("Email cannot be empty!");
      if (password == "") {
        setErrPasswordMsg("Password cannot be empty!");
        if (password2 == "") {
          setErrPasswordMsg2("Please confirm your password")
        }
      }
      if (password2 == "") {
        setErrPasswordMsg2("Please confirm your password")
      }
      return;
    }
    if (password == "") {
      setErrPasswordMsg("Password cannot be empty!");
      if (password2 == "") {
        setErrPasswordMsg2("Please confirm your password")
      }
      return;
    }

    if (password2 == "") {
      setErrPasswordMsg2("Please confirm your password!")
      return;
    }

    if (password2 !== password) {
      setErrPasswordMsg2("Your password is not the same!")
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) { 
      setErrMsg(error.message);
      return;
    }
  }

  return (
    <SafeAreaView style = {{flex: 1, alignItems: 'center', backgroundColor:'#f0ffff'}}>
      <View style = {{flex: 1, justifyContent: 'center', width: 300}}>
        <Logo />
        <Text style={style.text}> Email </Text>
        <TextInput 
          style = {style.input}
          placeholder = 'Enter your email here'
          mode = 'outlined'
          autoCapitalize="none"
          textContentType="emailAddress"
          value={email}
          onChangeText={setEmail} 
        />
        {errEmailMsg !== "" && <Text style = {style.error}>{errEmailMsg} </Text>}
        <Text style = {style.text}> Password </Text>
        <TextInput
          style = {style.input}
          placeholder = 'Enter your password here'
          mode = 'outlined'
          secureTextEntry
          autoCapitalize="none"
          textContentType="password"
          value={password}
          onChangeText={setPassword} 
        />
        {errPasswordMsg !== "" && <Text style = {style.error}>{errPasswordMsg} </Text>}
        <Text style = {style.text}> Confirm your Password </Text>
        <TextInput
          style = {style.input}
          placeholder = 'Please Confirm Your Password!'
          mode = 'outlined'
          secureTextEntry
          autoCapitalize="none"
          textContentType="password"
          value={password2}
          onChangeText={setPassword2} />
        {errPasswordMsg2 !== "" && <Text style = {style.error}>{errPasswordMsg2} </Text>}
        <Button 
          style={style.button}
          onPress = {handleRegister}
        >
          <Text style= {style.register}>REGISTER</Text>
        </Button>
        {errMsg !== "" && <Text style = {style.error}>{errMsg}</Text>}
        {loading && <ActivityIndicator />}
      </View>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  button: {
    marginVertical: '6%',
    backgroundColor: '#368ce7'
  },

  error: {
    color: 'red',
    left: 3,
    fontSize: 15,
    fontWeight: 600,
    marginVertical: '3%',
    textAlign: 'center',
  },

  input: {
    marginBottom: '2%'
  },

  register: {
    fontWeight: 800,
    color: 'white'
  },

  text: {
    fontSize: 18,
    fontWeight:600,
    marginTop: 20
  },

})