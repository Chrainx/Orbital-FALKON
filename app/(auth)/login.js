import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { useState } from "react";
import { Link } from "expo-router";
import { supabase } from "../../lib/supabase";
import { Logo } from "../components/logo";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [errEmailMsg, setErrEmailMsg] = useState('');
  const [errPasswordMsg, setErrPasswordMsg] = useState('');
  
  const handleLogin = async () => {
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
    const { error } = await supabase.auth.signInWithPassword({email, password});
    setLoading(false);
    if (error) {
      setErrMsg(error.message + "!");
      return;
    }
  }

  return (
    <SafeAreaView style= {{flex: 1, alignItems: 'center'}}>
      <Text> Login Page </Text>
      <View style = {{flex: 1, justifyContent: 'center', width: 300}}>
        <Logo />
        <Text>  Email</Text>
        <TextInput 
          style = {style.input}
          mode = 'outlined'
          placeholder = 'Enter your email here'
          autoCapitalize="none"
          textContentType="emailAddress"
          value={email}
          onChangeText={setEmail} />
          {errEmailMsg !== "" && <Text style = {style.error}>{errEmailMsg} </Text>}
        <Text 
        style = {style.text}>  Password</Text>
        <TextInput 
          style = {style.input}
          mode = 'outlined'
          placeholder = 'Enter your password here'
          secureTextEntry
          autoCapitalize="none"
          textContentType="password"
          value={password}
          onChangeText={setPassword} />
          {errPasswordMsg !== "" && <Text style = {style.error}>{errPasswordMsg} </Text>}
        <Button onPress = {handleLogin}> Login </Button>
        {loading && <ActivityIndicator />}
        {errMsg !== "" && <Text style = {style.error}>{errMsg} </Text>}
        <View style={{flexDirection: 'row', justifyContent : 'center', alignItems: 'center'}}>
          <Text> Don't have an account? </Text>
          <Link href="/register">
            <Text style={{color: "rgb(0,125,250)", }}> Register now </Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  input: {
    
  },

  text: {
    marginTop: 20
  },

  error: {
    color: 'red'
  },
})