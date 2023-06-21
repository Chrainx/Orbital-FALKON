import { useState, useEffect} from "react";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { View, ScrollView, TouchableOpacity, Image, Modal, Alert} from "react-native";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { useAuth } from "../../contexts/auth";
import { supabase } from "../../lib/supabase";
import { useIsFocused } from "@react-navigation/native";
export default function Expense() { 
  
  // For data about every expense
  const [data, setData] = useState([]);
  
  // For getiing color for each category
  const [color, setColor] = useState([]);

  // For remove duplicate date 
  const [date, setDate] = useState([]);

  // For limit
  const [limit, setLimit] = useState([]);

  // For Changing daily limit
  const [newLimit, setNewLimit] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // For find the total spending
  const [Total, setTotal] = useState(0);

  // For the loading indicator
  const [loading, setLoading] = useState(false);

  // For authentication
  const {user} = useAuth();

  // For refreshing
  const [refresh, setRefresh] = useState(false);
  const isFocused = useIsFocused();


  async function fetchData() {
    fetchCategory();
    fetchLimit();
    let {data} = await supabase.from('data').select('*').order('inserted_at', {ascending: false});
    if (data.length == 0) {
      setTotal(0);
    } else {
      setTotal(data.reduce((a, b) => a + b.amount, 0));
    }
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
    setRefresh(false);
  }

  async function fetchCategory() {
    let {data} = await supabase.from('category').select('*');
    setColor(data);
  }

  async function fetchLimit() {
    let {data} = await supabase.from('info').select("*");
    setLimit(data);
  }

  useEffect(() => {fetchData()}, []);
  useEffect(() => {if(isFocused){fetchData()}}, [isFocused]);
  useEffect(() => {if (refresh) {fetchData()}}, [refresh]);

  const handleDelete = async (itemId) => {
    setLoading(true);
    await supabase.from('data').delete().eq("id", itemId);
    setLoading(false);
    setRefresh(true);
  }

  const alertError = () => {
    Alert.alert(
      "Please Check",
      "Daily limit must be a number!",
      [
        {text: "Ok"},
      ]
    );
  }

  const handleChange = async () => {
    setLoading(true);
    if (isNaN(newLimit)) {
      setLoading(false);
      alertError();
      return;
    }
    var amt = parseFloat(newLimit).toFixed(2);
    if (limit.length == 0) {
      const { error } = await supabase.from('info').insert({limit: amt, user_id: user.id}).select().single();
    } else {
      await supabase.from('info').update({limit: amt}).eq("user_id", user.id);
    }
    setLoading(false);
    setRefresh(true);
  }


  return (
    <View style={{flexDirecton: 'row',justifyContent: "space-between", }}>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View 
          style = {{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 22,
          }}
        >
          <TextInput
            value={newLimit} 
            onChangeText={setNewLimit}
          />
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
          >
            <Text> Cancel </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={
              () => {
                setModalVisible(false);
                handleChange();
              }
            }
          >
            <Text> Change </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
      >
        <Text> Daily limit </Text>
        {limit.length != 0 && limit[0].limit != null
          ? <Text> {limit[0].limit} </Text>
          : <Text> - </Text> 
        }
      </TouchableOpacity>
      <ScrollView>
        {date && date.map(date => 
          <View key={date}>
            <Text style={{marginLeft: 15, marginVertical: 5}}> {new Date(date).toDateString()} </Text>
              {data.filter(b => b.inserted_at == date).map(item => 
              <Swipeable key={item.id} renderRightActions={() => (
                <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8,
                    marginBottom: 4,
                    marginRight: 15, 
                    backgroundColor: 'red',
                    width: 50,
                  }}
                  onPress={() => handleDelete(item.id)}
                >
                  <Image source={require('./tab-icons/trashcan.png')} resizeMode="contain" style={{ width: 40, height: 40, }}/>
                </TouchableOpacity>
              )}
              onSwipeableRight={() => handleDelete(item.id)}
              >
                <View 
                  style={{display: 'flex', 
                    flexDirection: 'column', 
                    marginBottom: 4,
                    marginHorizontal: 15,
                    backgroundColor: 'lightgrey',
                    justifyContent: 'space-between',
                    borderWidth: 2,
                    borderRadius: 8,
                  }}>
                  <View 
                    style= {{width: '100%',
                      display:'flex', 
                      flexDirection: 'row', 
                      justifyContent: 'space-between',
                      alignItems:'center',
                      marginBottom: 4,
                      }}>
                    <Text style={{fontSize: 15, fontWeight:'bold', marginLeft: 3}}>{item.name} </Text>
                    <Text style={{fontSize: 18, fontWeight:'bold', }}>USD {item.amount} </Text>
                  </View>
              
                  <View 
                    style= {{width: '100%',
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
                      <Text style = {{fontSize: 15, fontWeight: 'bold', marginRight: 3}}> put what</Text>
              </View>
            </View>
            </Swipeable>
            )}
          </View>
          
          
        )}
          
      </ScrollView>
      {loading && <ActivityIndicator />}
      <Text style={{fontSize: 20}}> Total: {Total}</Text>
    </View>
  );
}