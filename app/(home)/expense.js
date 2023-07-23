import { useState, useEffect} from "react";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { View, ScrollView, TouchableOpacity, Image, Modal, StyleSheet, Alert, SafeAreaView} from "react-native";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { useAuth } from "../../contexts/auth";
import { supabase } from "../../lib/supabase";
import { useIsFocused } from "@react-navigation/native";
import { MultipleSelectList } from 'react-native-dropdown-select-list'


export default function Expense() { 
  
  // For data about every expense
  const [data, setData] = useState([]);
  
  // For geting color for each category
  const [color, setColor] = useState([]);

  // For geting category
  const [category, setCategory] = useState([]);

  // For remove duplicate date 
  const [date, setDate] = useState([]);

  // For limit
  const [limit, setLimit] = useState([]);

  // For left:
  const [isRemaining , setIsRemaining] = useState(false);

  // For Changing daily limit
  const [newLimit, setNewLimit] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  //For total spending for today
  const [today, setToday] = useState(0);

  // For find the total for all spending
  const [Total, setTotal] = useState(0);

  // For the loading indicator
  const [loading, setLoading] = useState(false);

  // For authentication
  const {user} = useAuth();

  // For filter
  const [filter, setFilter] = useState([]);

  // For refreshing
  const [refresh, setRefresh] = useState(false);
  const isFocused = useIsFocused();


  async function fetchData() {
    setLoading(true);
    setRefresh(true);
    fetchCategory();
    fetchLimit();
    fetchExpense();
    setRefresh(false);
    setLoading(false);
  }

  async function fetchExpense() {
    let {data} = await supabase.from('data').select("*").order("inserted_at", {ascending: false});
    setToday(data.filter(x => new Date(x.inserted_at).toDateString() == new Date().toDateString()). reduce((a,b) => a + b.amount, 0));
    if (filter && filter.length > 0) {
      data = data.filter(x => filter.includes(x.category));
    }
    setData(data);
    const newArr = [];
    if (data.length == 0) {
      setTotal(0);
      setDate([]);
    } else {
      setTotal(data.reduce((a, b) => a + b.amount, 0));
      newArr.push(new Date(data[0].inserted_at).toDateString());
      for (var i = 1; i < data.length; i++) {
        if (newArr[newArr.length - 1] !== new Date(data[i].inserted_at).toDateString()) {
          newArr.push(new Date(data[i].inserted_at).toDateString())
        }
      }
      setDate(newArr);
    }
  }

  async function fetchCategory() {
    let {data} = await supabase.from('category').select('*');
    setColor(data);
    setCategory(data.map(x =>{return {key: x.id, value: x.category}}));
  }

  async function fetchLimit() {
    let {data} = await supabase.from('info').select("*");
    setLimit(data);
  }

  useEffect(() => {fetchData()}, []);
  useEffect(() => {if(isFocused) {fetchData()}}, [isFocused]);
  useEffect(() => {if(refresh) {fetchData()}}, [refresh]);

  const handleDelete = async (itemId) => {
    setLoading(true);
    await supabase.from('data').delete().eq("id", itemId);
    setLoading(false);
    setRefresh(true);
  }

  const handleChange = async () => {
    setLoading(true);
    if (newLimit == "") {
      setLoading(false);
      alertError("Daily limit cannot change to empty!");
      return;
    }
    if (isNaN(newLimit)) {
      setLoading(false);
      alertError("Daily limit must be a number!");
      return;
    }
    if (newLimit<0) {
      setLoading(false);
      alertError("Daily limit cannot be a negative number!");
      return;
    }
    var amt = parseFloat(newLimit).toFixed(2);
    await supabase.from('info').update({limit: amt}).eq("user_id", user.id);
    setLoading(false);
    setNewLimit("");
    setRefresh(true);
  }

  const handleReset = async () => {
    setLoading(true);
    let {data} =  await supabase.from('info').select('*');
    await supabase.from('info').update({limit: null}).eq("user_id", user.id);
    setLoading(false);
    setNewLimit("");
    setRefresh(true);
  }

  const alertError = (errorString) => {
    Alert.alert(
      "Please Check",
      errorString,
      [
        {text: "Ok"},
      ]
    );
  }

  return (
    <View style={{flex: 1, flexDirecton: 'row',justifyContent: "space-between", backgroundColor: '#f0ffff'}}>
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
            //flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: 'black',
            borderWidth: 1,
            borderRadius: 20,
            backgroundColor:'#c1d5f0',
            //marginVertical: '80%',
            //width: '50%',
            width: 200,
            height: 150,
            //position: 'absolute',
            top: '40%',
            left: '25%',
          }}
        >
          <Text style={{color: 'black', fontSize:20, marginTop: 5}}> Set the Daily Limit: </Text>
          <View style={{flexDirection:'row', alignItems: 'center',}}>
            <TextInput
              style={{marginTop: 5, marginLeft: 5,  width: 100}}
              mode="outlined"
              value={newLimit} 
              onChangeText={setNewLimit}
            />
            <TouchableOpacity
              style={{marginTop: 10, marginLeft: 10,}}
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
          <View 
            style={{flexDirection:'row', width: '100%', justifyContent:'space-around'}}
          >
            <TouchableOpacity 
              style={{marginTop: 15, marginBottom: 5,}}
              onPress={
                () => {
                  handleReset();
                  setModalVisible(false);
                }
              }
            >
              <Text style= {style.resetCancel}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style= {{
                marginTop: 15,
                marginBottom: 5,
              }}
              onPress={() => setModalVisible(false)}
            >
            <Text style= {style.resetCancel}> Cancel </Text>
          </TouchableOpacity>

          </View>

        </View>
      </Modal>

      <View style={{flexDirection:'row', alignItems:'center',}}>
      <TouchableOpacity
        style={{
          alignItems:'center',
          flex: 1.5,
          backgroundColor:'#bedaf7',
          borderTopWidth: 2,
          borderBottomWidth: 2,
          borderRightWidth:1
        }}
        onPress={() => setModalVisible(true)}
      >
        <Text style={style.header}> Daily limit </Text>
        {limit && limit.length != 0 && limit[0].limit != null
          ? <Text style={style.spentRemainLimit}><Text style={{fontSize: 18}}>SGD </Text>{limit[0].limit} </Text>
          : <Text style={style.spentRemainLimit}> - </Text> 
        }
      </TouchableOpacity>

      <TouchableOpacity
        style={{ alignItems: 'center', flex: 2.5, backgroundColor:'#c8dfea', borderTopWidth: 2, borderBottomWidth: 2, borderLeftWidth:1}}
        onPress={() => setIsRemaining(!isRemaining)}>
        {isRemaining
          ? data && limit && limit.length != 0 && limit[0].limit != null
            ? limit[0].limit - data.filter(x => new Date(x.inserted_at).toDateString() == new Date().toDateString()).reduce((a,b) => a + b.amount, 0) >= 0
              ? <Text style={{fontSize: 20, fontWeight: 700}}> Remaining Budget </Text>
              : <Text style={{fontSize: 20, fontWeight: 700, color: 'red'}}> Over Spent </Text>
            : <Text></Text>
          : <Text style = {style.header}> Total Spent Today </Text>
        }

        {isRemaining 
          ? data && limit && limit.length != 0 && limit[0].limit != null
            ? limit[0].limit - data.filter(x => new Date(x.inserted_at).toDateString() == new Date().toDateString()).reduce((a,b) => a + b.amount, 0) >= 0
              ?<Text style={style.spentRemainLimit}> <Text style={style.sgdHeader}>SGD </Text>{(limit[0].limit - today).toFixed(2)} </Text>  
              :<Text style={style.spentRemainLimit}> <Text style={style.sgdHeader}>SGD </Text>{(-limit[0].limit + today).toFixed(2)} </Text>  
            : <Text style={{fontSize: 17, textAlign:'center', bottom: '10%'}}> Please Set Your Daily Limit{'\n'}First </Text>
          : data && <Text style={style.spentRemainLimit}> <Text style={{fontSize: 18}}>SGD </Text>{today.toFixed(2)}</Text>
        }
      </TouchableOpacity>
      </View>
      <View>
        <MultipleSelectList
            setSelected= {(val) => {setFilter(val); setRefresh(true)}}
            data={category} 
            save="value" 
            label="Categories Selected"
            badgeStyles= {{backgroundColor: '#1666ba'}}
            checkBoxStyles={{backgroundColor: '#f0ffff'}}
            notFoundText="No category found"
            placeholder="Filter by Category"
            searchPlaceholder="Find Categories..."
            boxStyles={{
              backgroundColor: '#90b1e7', 
              borderWidth: 2, 
              marginHorizontal: 15,
              marginTop: 8, 
              borderColor: 'black',
            }}
            dropdownStyles={{
              backgroundColor: '#deecfb', 
              borderWidth: 2, 
              marginHorizontal: 15,
              marginTop: 8, 
              borderColor: 'black',
            }}
            dropdownTextStyles={{fontWeight: 700}}
            badgeTextStyles={{fontWeight: 700}}
            labelStyles={{color: '#f0ffff', fontSize: 18}}
        />
      </View>
      
      <ScrollView>
        {date && date.map(date => 
          <View key={date}>
            <View style={{flexDirection:'row',justifyContent:'space-between', marginTop: '2%'}}>
              <Text style={{marginLeft: 16, marginVertical: 5, fontWeight: 600}}> {date} </Text>
              <Text style={{marginRight: 18, marginVertical: 5, fontWeight: 600}}> 
                Daily Total: 
                <Text style={{fontSize: 11}}>SGD </Text> 
                <Text style={{fontWeight: 700}}>{(data.filter(b => new Date(b.inserted_at).toDateString() == date).reduce((a,b) => a + b.amount,0)).toFixed(2)}</Text>
              </Text>
            </View>

              {data && data.filter(b => new Date(b.inserted_at).toDateString() == date).map(item => 
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
                <View style={style.expenseList}>
                  <View 
                    style= {{width: '100%',
                      display:'flex',  
                      marginBottom: 4,
                      
                      justifyContent:'flex-end',
                      flex: 1,
                      }}>
                    <Text style={{
                      fontSize: 15, 
                      fontWeight: 700, 
                      marginLeft: 7, 
                      marginVertical: '2%'
                      }}
                      > {item.name} </Text>
                    <Text 
                      style={{
                        fontSize: 15, 
                        fontWeight: 700,
                        marginLeft: 7, 
                        color: 
                          color.filter(a => a.category == item.category).length == 0 
                          ? 'black' 
                          : color.filter(a => a.category == item.category)[0].color
                      }}
                    > {item.category}</Text>
                    
                  </View>
              
                  <View 
                    style= {{
                      width: '100%',
                      display:'flex',
                      flex:1,
                      alignItems:'flex-end',
                      justifyContent:'center'
                    }}
                  >
                  <Text style={{fontSize: 20, fontWeight: 700, marginRight: 2}}><Text style={{fontSize: 15}}>SGD</Text> {(item.amount).toFixed(2)} </Text>
                      
              </View>
            </View>
            </Swipeable>
            )} 
          </View>
        )}  
        </ScrollView>
      {loading && <ActivityIndicator />}
      <Text style={{fontSize: 20, fontWeight: 600, textAlign:'left', borderBottomWidth: 0, borderWidth: 1, backgroundColor:'#b4cbf0'}}> Total: <Text style={{fontSize: 13}}> SGD </Text>{Total.toFixed(2)}</Text>
    </View>
  );
}

const style = StyleSheet.create({
  header: {
    fontSize: 20, 
    fontWeight: 700
  }, 
  
  expenseList: {
    display: 'flex', 
    flexDirection: 'row', 
    marginBottom: 4,
    marginHorizontal: 15,
    backgroundColor: '#deecfb',
    justifyContent: 'space-between',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
  },

  resetCancel: {
    color: 'red', 
    fontSize: 18,
  },

  spentRemainLimit: {
    fontSize: 25, 
    fontWeight:500
  },

  textList: {
    fontSize: 15, fontWeight: 700, marginLeft: 7, 
  },

  sgdHeader: {
    fontSize: 18
  },
})