import { useState, useEffect } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { useAuth } from "../../contexts/auth";
import { supabase } from "../../lib/supabase";

export default function  Homepage() { 
  const [data, setData] = useState([]);
  const [dailyLimit, setDailyLimit] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [limit, setLimit] = useState('');
  const [errNameMsg, setErrNameMsg] = useState('');
  const [errCategoryMsg, setErrCategoryMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const {user} = useAuth();
  
  async function fetchData() {
    let {data} = await supabase.from('data').select('*');
    let {dailyLimit} = await supabase.from('limit').select('*');
    console.log(dailyLimit);
    setData(data);
    setDailyLimit(dailyLimit);
    setRefresh(false);
  }
  
  useEffect(() => {
    fetchData()
  }, []);

  useEffect(() => {
    if (refresh) {
      fetchData()
    }
  }, [refresh]);

  const handleAdd = async () => {
    setErrNameMsg('');
    setErrMsg('');
    setErrCategoryMsg('');
    if (name == '') {
      setErrNameMsg("Name cannot be empty");
      if (category == '') {
        setErrCategoryMsg("Category cannot be empty");
      } 
      return;
    }
    if (category == '') {
      setErrCategoryMsg("Category cannot be empty");
      return;
    } 
    setLoading(true);
    const { error } = await supabase.from('data').
      insert({name: name, category: category, amount: parseFloat(amount), user_id: user.id})
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
    await supabase.from('data').delete().eq("id", itemId);
    setLoading(false);
    setRefresh(true);
  }

  const handleChange = async () => {
    setErrMsg('');
    setLoading(true);
    await supabase.from('limit').insert({daily_limit: parseFloat(limit), user_id: user.id});
    setLoading(false);
    setRefresh(true);
  }

  return (
      <SafeAreaView style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
         <View style = {{flexDirection: 'row', alignItems: "center", justifyContent:"center"}}>
          <Text style ={{flexDirection: 'row', alignItems: "center", justifyContent:"center"}}> Daily Limit: </Text>
          <FlatList 
            data = {dailyLimit}
            style = {{flexDirection: 'row', width:300}}
            renderItem = {
              ({item}) => 
              <View>
                <Text>{item.limit}</Text>
              </View>
            }
            refreshing = {refresh}
          />
         </View>
        <View style = {{flexDirection: 'row'}}>
          <TextInput 
              mode = 'outlined'
              placeholder = 'Daily Limit'
              value={limit} 
              onChangeText={setLimit} />
          <Button onPress={handleChange}> Change </Button>
        </View>
        <FlatList 
          data = {data} 
          style = {{flexDirection: 'row', width:300}}
          renderItem = {
            ({item}) => 
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:"space-between", width:300}}>
              <Text>{item.name}</Text>
              <Text>{item.category}</Text>
              <Text>{item.amount}</Text>
              <Button onPress={() => handleDelete(item.id)}> - </Button> 
            </View>
          }
          refreshing = {refresh}
        />
        <Text>Insert a new data:</Text>
        <View style={{flexDirection:'row', width: 300, alignItems:'center', justifyContent:'center'}}>
          <View style={{flexDirection:'column', width:240}}>
            <TextInput 
              mode = 'outlined'
              placeholder= 'Activity'
              value={name} 
              onChangeText={setName} />
            {errNameMsg !== '' && <Text style={{color:'red'}}> {errNameMsg}! </Text>}

            <TextInput 
              mode = 'outlined'
              placeholder = 'Category'
              value={category} 
              onChangeText={setCategory} />
            {errCategoryMsg !== '' && <Text style={{color:'red'}}> {errCategoryMsg}! </Text>}

            <TextInput
              mode = 'outlined' 
              placeholder = 'Amount'
              value={amount} 
              onChangeText={setAmount} />
            {errMsg !== '' && <Text style={{color:'red'}}> {errMsg}! </Text>}

          </View>
          <Button style={{width:60}} onPress={handleAdd}> + </Button>
        </View>
        {loading && <ActivityIndicator />}
        <Button onPress={() => supabase.auth.signOut()}> Logout</Button> 
      </SafeAreaView>
  );
}