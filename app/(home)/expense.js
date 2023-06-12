import { useState, useEffect } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { useAuth } from "../../contexts/auth";
import { supabase } from "../../lib/supabase";
import { useIsFocused } from "@react-navigation/native";

export default function Expense() { 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const {user} = useAuth();
  const isFocused = useIsFocused();

  async function fetchData() {
    let {data} = await supabase.from('data').select('*');
    setData(data);
    setRefresh(false);
  }

  useEffect(() => { fetchData() }, [isFocused]);
  
  useEffect(() => {
    fetchData()
  }, []);

  useEffect(() => {
    if (refresh) {
      fetchData()
    }
  }, [refresh]);

  const handleDelete = async (itemId) => {
    setLoading(true);
    await supabase.from('data').delete().eq("id", itemId);
    setLoading(false);
    setRefresh(true);
  }

  return (
      <SafeAreaView style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <FlatList 
          data = {data} 
          style = {{flexDirection: 'row', width:300}}
          renderItem = {
            ({item}) => 
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:"space-between", width:300}}>
              <Text>{item.inserted_at}</Text>
              <Text>{item.name}</Text>
              <Text>{item.category}</Text>
              <Text>{item.amount}</Text>
              <Button onPress={() => handleDelete(item.id)}> - </Button> 
            </View>
          }
          refreshing = {refresh}
        />
        {loading && <ActivityIndicator />}
      </SafeAreaView>
  );
}