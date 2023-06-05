import { useState, useEffect, useRef } from "react";
import { FlatList, View, DrawerLayoutAndroid } from "react-native";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { useAuth } from "../../contexts/auth";
import { supabase } from "../../lib/supabase";

export default function  Homepage() { 
  const [dates, setDates] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState(0);
  const [errNameMsg, setErrNameMsg] = useState('');
  const [errCategoryMsg, setErrCategoryMsg] = useState('');
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
    const { error } = await supabase.from('dates').
      insert({name: name, category: category, amount: parseFloat(amount), user_id: user.id, time:[100000]})
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

  const drawer = useRef(null);
  const navigationView = () => (
    <View>
      <Button onPress={() => supabase.auth.signOut()}> Logout</Button> 
      <Button
        textColor="red"
        onPress={() => drawer.current.closeDrawer()}
      >
        close
      </Button>
    </View>
  );

  return (
    <DrawerLayoutAndroid
      ref = {drawer}
      drawerWidth = {300}
      drawerPosition = {'left'}
      renderNavigationView = {navigationView}>
      <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <Button style ={{alignItems: 'flex-start'}} onPress={() => drawer.current.openDrawer()}>
          Profile
        </Button>
        <FlatList 
          data = {dates} 
          style = {{flexDirection: 'row', width:300}}
          renderItem={
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
      </View>
    </DrawerLayoutAndroid>
  );
}