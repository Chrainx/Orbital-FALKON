import { useState, useEffect } from "react";
import { FlatList, View } from "react-native";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { useAuth } from "../../contexts/auth";
import { supabase } from "../../lib/supabase";

export default function  Homepage() { 
  const [dates, setDates] = useState([]);
  const [input, setInput] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const {user} = useAuth();
  
  async function fetchDates() {
    let {data} = await supabase.from('dates').select('*');
    setDates(data);
    setRefresh(false);
  }
  
  useEffect(() => {
    fetchDates()
  }, []);

  useEffect(() => {
    if (refresh) {
      fetchDates()
    }
  }, [refresh]);

  const handleAdd = async () => {
    setErrMsg('');
    if (input == '') {
      setErrMsg("Input cannot be empty");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('dates').
      insert({date: input, user_id: user.id, time:[100000]})
      .select()
      .single();
    setLoading(false);
    if (error != null) {
      setErrMsg(error.message + "!");
      return;
    }
    setRefresh(true);
  }

  const handleDelete = async () => {
    setErrMsg('');
    setLoading(true);
    await supabase.from('dates').delete().eq('date', input);
    setLoading(false);
    setRefresh(true);
  }

  return (
      <View style={ {flex: 1, alignItems: "center", justifyContent: "center"}}>
        <FlatList 
          data = {dates} 
          renderItem={
            ({item}) => 
            <View style={{flexDirection: 'row'}}>
              <Text>{item.date}</Text>
            </View>
          }
          refreshing = {refresh}
        />
        <Text> New input: </Text>
        <TextInput value={input} onChangeText={setInput} />
        {errMsg !== '' && <Text style={{color:'red'}}> {errMsg}! </Text>}
        <View style={{flexDirection:'row'}}>
          <Button onPress={handleAdd}> + </Button> 
          <Button onPress={handleDelete}> - </Button>
        </View>
        {loading && <ActivityIndicator />}
      </View>
  );
}