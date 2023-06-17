import { useState, useEffect } from "react";
import { FlatList, View } from "react-native";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { useAuth } from "../../contexts/auth";
import { supabase } from "../../lib/supabase";
import { useIsFocused } from "@react-navigation/native";

export default function Expense() { 
  const [data, setData] = useState([]);
  const [Total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const {user} = useAuth();
  const isFocused = useIsFocused();

  async function fetchData() {
    let {data} = await supabase.from('data').select('*');
    setTotal(data.reduce((a, b) => a + b.amount, 0));
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
      <View style={{flexDirecton: 'row',justifyContent: "space-between", }}>
        <FlatList
          data= {data}
          //style = {{flexDirection: 'row', width: '100%', }}
          renderItem ={({item}) => 
            // <View style={{flexDirection:'row', 
            //       alignItems:'center', 
            //       justifyContent:"space-between", 
            //       backgroundColor: 'gray', 
            //       }}>                
            //   <Text>{item.inserted_at} </Text>
            //   <Text>{item.name} </Text>
            //   <Text>{item.category} </Text>
            //   <Text>{item.amount} </Text>
            //   <Button onPress={() => handleDelete(item.id)}> - </Button>
            <View style={{display: 'flex', flexDirection: 'column', marginBottom: 12, width: '100%', }}>
              <View style= {{width: '100%',
                    display:'flex', 
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    alignItems:'center',
                    marginBottom: 4,}}>
                  <Text style={{fontSize: 15, backgroundColor:'lightblue'}}>{item.name} </Text>
                  <Text style={{fontSize: 15,backgroundColor:'lightgrey'}}>Currency {item.amount} </Text>
              </View>
              
              <View style= {{width: '100%',
                    display:'flex', 
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    alignItems:'center',
                    }}>
                  <Text style={{fontSize: 15, backgroundColor:'yellow'}}>{item.category} </Text>
                  <Text style={{fontSize: 15, backgroundColor: 'pink'}}>{item.inserted_at} </Text>
              </View>
              <View style={{marginTop: 5, borderBottomWidth: 1}}></View> 
              <Button style = {{marginTop: 4, backgroundColor: '#6699CC'}} onPress={() => handleDelete(item.id)}> Delete </Button>
            </View>
          }
          refreshing = {refresh}
        />
        {loading && <ActivityIndicator />}
        <Text style={{fontSize: 20}}> Total: {Total}</Text>
      </View>
  );
}