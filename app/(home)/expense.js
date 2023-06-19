import { useState, useEffect } from "react";
import { FlatList, View } from "react-native";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { useAuth } from "../../contexts/auth";
import { supabase } from "../../lib/supabase";
import { useIsFocused } from "@react-navigation/native";

export default function Expense() { 
  const [data, setData] = useState([]);
  const [color, setColor] = useState([]);
  const [date, setDate] = useState([]);
  const [Total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const {user} = useAuth();
  const isFocused = useIsFocused();

  async function fetchData() {
    let {data} = await supabase.from('data').select('*').order('inserted_at', {ascending: false});
    setTotal(data.reduce((a, b) => a + b.amount, 0));
    setData(data);
    //console.log(data);
    const newArr = [];
    if(data.length > 0) {
      newArr.push(data[0].inserted_at)
    }
    for (var i = 1; i < data.length; i++) {
      if (newArr[newArr.length - 1] !== data[i].inserted_at) {
        newArr.push(data[i].inserted_at)
      }
    }
    setDate(newArr);
    data = await supabase.from('category').select('*')
    setColor(data);
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
            <View style={{display: 'flex', 
                  flexDirection: 'column', 
                  marginBottom: 12,
                  marginHorizontal: 15,

                  backgroundColor: 'lavender',
                  justifyContent: 'space-between',
                  borderWidth: 3,
                  borderRadius: 8,
            }}>
              <View style= {{width: '100%',
                    display:'flex', 
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    alignItems:'center',
                    marginBottom: 4,}}>
                  <Text style={{fontSize: 15, fontWeight:'bold', backgroundColor:'lightblue'}}>{item.name} </Text>
                  <Text style={{fontSize: 15, fontWeight:'bold', backgroundColor:'lightgrey'}}>Currency {item.amount} </Text>
              </View>
              
              <View style= {{width: '100%',
                    display:'flex', 
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    alignItems:'center',
                    }}>
                  <Text style={{fontSize: 15, fontWeight:'bold', backgroundColor:'yellow'}}>{item.category} </Text>
                  <Text style={{fontSize: 15, fontWeight:'bold', backgroundColor: 'pink'}}>{item.inserted_at} </Text>
              </View>

              <View style={{marginTop: 5, borderBottomWidth: 5, marginHorizontal: 3}}></View> 
              <Button style = {{marginVertical: 4, marginHorizontal: 5,backgroundColor: '#6699CC'}} onPress={() => handleDelete(item.id)}> Delete </Button>
            </View>
          }
          refreshing = {refresh}
        />

        <Text> testing </Text>
    
        {date && date.map(a => 
          <View key={a}>
            <Text> {a} </Text>
              {data.filter(b => b.inserted_at == a).map(c => 
                <View key = {c.name} style= {{flexDirection: 'row'}}>
                  <Text> {c.name} </Text>
                  <Text> {c.category} </Text>
                  <Text> {c.amount} </Text>
                </View>
            )}
          </View>
        )}
        
        {loading && <ActivityIndicator />}
        <Text style={{fontSize: 20}}> Total: {Total}</Text>
      </View>
  );
}