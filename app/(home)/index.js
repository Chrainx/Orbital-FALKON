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
      if (error.message == 'new row for relation "dates" violates check constraint "todos_task_check"'){
        setErrMsg("Input must be longer than 3 character");
      }
      return;
    }
    setRefresh(true);
  }

  const handleDelete = async (itemId) => {
    setErrMsg('');
    setLoading(true);
    await supabase.from('dates').delete().eq("id", itemId);
    setLoading(false);
    setRefresh(true);
  }

  return (
      <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <FlatList 
          data = {dates} 
          style = {{flexDirection: 'row', width:300}}
          renderItem={
            ({item}) => 
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:"space-between", width:300}}>
              <Text>{item.date}</Text>
              <Button onPress={() => handleDelete(item.id)}> - </Button> 
            </View>
          }
          refreshing = {refresh}
        />
        <Text> New input: </Text>
        <View style={{flexDirection:'row', width: 300, alignItems:'center', justifyContent:'center'}}>
          <View style={{flexDirection:'column', width:240}}>
            <TextInput value={input} onChangeText={setInput} />
            {errMsg !== '' && <Text style={{color:'red'}}> {errMsg}! </Text>}
          </View>
          <Button style={{width:60}} onPress={handleAdd}> + </Button>
        </View>
        {loading && <ActivityIndicator />}
      </View>
  );
}