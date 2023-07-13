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
      setErrMsg(error.message);
      if (error.message == 'Invalid login credentials') {
        setErrMsg("Wrong Email or Password!")
      }
      return;
      }
  }

  return (
    <SafeAreaView style= {{flex: 1, alignItems: 'center', backgroundColor:'#f0ffff'}}>
      <View style = {{flex: 1, justifyContent: 'center', width: 300,}}>
        <Logo />
        <Text></Text>
        <Text style={{fontSize: 18, fontWeight: 600}}>  Email </Text>
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
        style = {{fontSize: 18, fontWeight: 600, marginTop: 20}}>  Password</Text>
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
        <Button 
          style={{marginVertical: '6%', backgroundColor: '#368ce7'}}
          onPress = {handleLogin}><Text style= {{fontWeight:800, color: 'white', }}>LOGIN</Text></Button>
        {loading && <ActivityIndicator />}
        {errMsg !== "" && <Text style = {style.error}>{errMsg} </Text>}
        <View style={{flexDirection: 'row', justifyContent : 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 15, fontWeight: 600}}> Don't have an account? </Text>
          <Link href="/register">
            <Text style={{fontSize: 15, color: "rgb(0,125,250)", fontWeight: 600}}> Register Here. </Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  input: {
    marginBottom: '2%'
  },

  error: {
    color: 'red',
    left: 3,
    fontSize: 15,
    fontWeight: 600,
    marginVertical: '3%',
    textAlign: 'center'
  },
})