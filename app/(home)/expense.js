import { useState, useEffect } from "react";
import { FlatList, View, ScrollView, TouchableOpacity} from "react-native";
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
    fetchCategory();
    setRefresh(false);
  }

  async function fetchCategory() {
    let {data} = await supabase.from('category').select('*');
    setColor(data);
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
      <ScrollView>
        {date && date.map(a => 
          <View key={a}>
            <Text style={{marginLeft: 15, marginVertical: 5}}> {a} </Text>
              {data.filter(b => b.inserted_at == a).map(item => 
                <View 
                key={item.name}
                style={{display: 'flex', 
                  flexDirection: 'column', 
                  marginBottom: 4,
                  marginHorizontal: 15,

                  backgroundColor: 'lightgrey',
                  justifyContent: 'space-between',
                  borderWidth: 2,
                  borderRadius: 8,
                }}>
              <View style= {{width: '100%',
                    display:'flex', 
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    alignItems:'center',
                    marginBottom: 4,
                    }}>
                  <Text style={{fontSize: 15, fontWeight:'bold', marginLeft: 3}}>{item.name} </Text>
                  <Text style={{fontSize: 18, fontWeight:'bold', }}>USD {item.amount} </Text>
              </View>
              
              <View style= {{width: '100%',
                    display:'flex', 
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    alignItems:'center',
                    }}>
                  <Text 
                  style={{
                    fontSize: 15, 
                    fontWeight:'bold',
                    marginLeft: 3, 
                    //backgroundColor:'yellow',
                    color: color.filter(a => a.category == item.category).length == 0 ? 'black' : color.filter(a => a.category == item.category)[0].color
                  }}>{item.category} </Text>
                  {/* <Button style = {{marginVertical: 4, marginHorizontal: 5, backgroundColor: '#6699CC'}} onPress={() => handleDelete(item.id)}> Delete </Button> */}
                  <TouchableOpacity style = {{
                        marginRight: 3, 
                        borderColor:'white', 
                        borderWidth:1, 
                        borderRadius: 200, 
                        marginBottom: 2, }}
                        onPress={() => handleDelete(item.id)}>
                        <Text style={{fontSize:18, color:'red'}}> Delete </Text></TouchableOpacity>
              </View>


              {/* <View style={{marginTop: 5, borderBottomWidth: 1, borderColor:'grey', marginHorizontal: 3}}></View> 
              <Button style = {{marginVertical: 4, marginHorizontal: 5,backgroundColor: '#6699CC'}} onPress={() => handleDelete(item.id)}> Delete </Button> */}
            </View>
            )}
          </View>
        )}
        </ScrollView>
        {loading && <ActivityIndicator />}
        <Text style={{fontSize: 20}}> Total: {Total}</Text>
        
      </View>
  );
}