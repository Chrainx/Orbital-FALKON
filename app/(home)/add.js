import { StyleSheet, SafeAreaView, View, Text, Image, FlatList, TouchableOpacity, Touchable} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { NewAdd } from './newAdd';
import { useAuth } from '../../contexts/auth';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useIsFocused } from "@react-navigation/native";
import { BottomSheet } from '@rneui/themed';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function Add () {
  //For supabase
  const {user} = useAuth();

  //For Refresh
  const isFocused = useIsFocused()
  
  //For Date
  const [date, setDate] = useState(new Date());
  const [datePicker , setDatePicker] = useState(false);

  //For Expense
  const [expense, setExpense] = useState('');
  const [expenseDetail, setExpenseDetail] = useState(false);

  //For Category
  const [category, setCategory] = useState('');
  const [visible, setVisible] = useState(false);

  //For Amount
  const [amount, setAmount] = useState('');
  const [amountDetail, setAmountDetail] = useState(false);

  //fetching
  const [data, setData] = useState([]);

  //For error
  const [errExpenseMsg, setErrExpenseMsg] = useState('');
  const [errAmountMsg, setErrAmountMsg] = useState('');

  const handleSubmit = async () => {
    setErrExpenseMsg('');
    setErrAmountMsg('');
    var amt = parseFloat(amount).toFixed(2);
    if (expense == '') {
      setErrExpenseMsg("Expense cannot be empty");
      if (amount == '') {
      setErrAmountMsg("Amount cannot be empty");
      return;
      }
      if (isNaN(amt)) {
        setErrAmountMsg("Amount must be a number");
      } 
      return;
    }
    if (amount == '') {
      setErrAmountMsg("Amount cannot be empty");
      return;
    }
    if (isNaN(amt)) {
      setErrAmountMsg("Amount must be a number");
      return;
    }
    if(amt < 0) {
      setErrAmountMsg("Amount cannot be a negative value");
      return;
    }
    if (category == '') {
      setCategory("None")
    }
    const { error } = await supabase.from('data').
      insert({name: expense, inserted_at: date, category: category, amount: amt, user_id: user.id})
      .select()
      .single();

    if (error != null) {
      setErrAmountMsg(error.message);
      return;
    }
    setExpense('');
    setAmount('');
    setCategory('');
    setExpenseDetail(false);
    setAmountDetail(false);
    setDate(new Date());
  }

  async function fetchCategory() {
    let {data} = await supabase.from('category').select('*');
    setData(data);
  }

  useEffect(() => {fetchCategory()} ,[]);
  useEffect(() => {fetchCategory()}, [isFocused]);

  return (
    <SafeAreaView>
      <Text> Add </Text>
      <NewAdd
        title= "Date"
        icon= {<Text style={{color: 'white'}}> {date.toDateString()}</Text>}
        action={() => setDatePicker(true)}
      />
       <DateTimePickerModal
        isVisible={datePicker}
        mode="date"
        onConfirm={(date) => {setDate(date); setDatePicker(false)}}
        onCancel={() => setDatePicker(false)}
      />
      <NewAdd
        title= 'Expense'
        icon= {
          expenseDetail 
          ? <Text style={{color: 'white'}}> Cancel </Text>
          : expense != ''
          ? <Text style={{color: 'white'}}> {expense} </Text>
          : <Image source={require('./tab-icons/arrowdown.png')} resizeMode="contain" style={{ width: 25, height: 25, }}/>
        }
        action= { () => { 
          if (expenseDetail) {
            setExpense('');
            setExpenseDetail(false);
          } else {
            setExpenseDetail(true);
          }
        }}
        detail= {
          expenseDetail 
          ? <View style = 
              {{
                flexDirection: 'row', 
                alignItems: 'center',
                borderRadius: 8,
                marginTop: 1,
                marginHorizontal: 15,
                marginBottom: 8,
                //width: '100%', 
                justifyContent:'space-between', 
                backgroundColor:'#5A5A5A'
                }}>
              <TextInput
                placeholder= 'Insert Expense'
                textColor='white'
                placeholderTextColor='white'
                value={expense} 
                onChangeText={setExpense}
                style={ 
                  style.textInput
                }
              />
              <TouchableOpacity style=
              {{
                marginRight: 20, 
                borderWidth:1, 
                borderColor:'#6699CC', 
                backgroundColor:'#6699CC', borderRadius: 25}} 
                onPress={() => setAmountDetail(false
                )}>

                <Text style = {{
                  color: 'white', 
                  fontSize:15, 
                  marginVertical: 5, 
                  marginHorizontal:8,
                  }}>
                    Insert
                </Text>
              </TouchableOpacity>
              {/* <Button 

              onPress={() => setExpenseDetail(false)}
              textColor='white'
              buttonColor='#6699CC'
              > 
              Insert </Button>  */}
            </View>

          : undefined 
        }
      />

      <NewAdd
        title= 'Category'
        icon={
          visible || category != ''
          ? <Text style = {{color: 'white'}}>{category}</Text>
          : <Image source={require('./tab-icons/arrowdown.png')} resizeMode="contain" style={{ width: 25, height: 25, }}/>
        }
        action={() => {setVisible(true)}}
      />

      <NewAdd
        title= 'Amount'
        icon= {
          amountDetail 
          ? <Text style={{color: 'white'}}> Cancel </Text>
          : amount != ''
          ? <Text style={{color: 'white'}}> {amount} </Text>
          : <Image source={require('./tab-icons/arrowdown.png')} resizeMode="contain" style={{ width: 25, height: 25, }}/>
        }
        action= { () => { 
          if (amountDetail) {
            setAmount('');
            setAmountDetail(false);
          } else {
            setAmountDetail(true);
          }
        }}
        detail= {
          amountDetail 
          ? <View style = 
              {{
                flexDirection: 'row', 
                alignItems: 'center',
                borderRadius: 8,
                marginTop: 1,
                marginHorizontal: 15,
                marginBottom: 8,
                //width: '100%',
                justifyContent:'space-between', 
                backgroundColor:'#5A5A5A'
                  }}
            >
              <TextInput
                placeholder= 'Insert Amount'
                textColor='white'
                placeholderTextColor='white'
                value={amount} 
                onChangeText={setAmount}
                style={style.textInput}
              />
              <TouchableOpacity style=
              {{
                marginRight: 20, 
                borderWidth:1, 
                borderColor:'#6699CC', 
                backgroundColor:'#6699CC', borderRadius: 25}} 
                onPress={() => setAmountDetail(false
                )}>

                <Text style = {{
                  color: 'white', 
                  fontSize:15, 
                  marginVertical: 5, 
                  marginHorizontal:8,
                  }}>
                    Insert
                </Text>
              </TouchableOpacity>
              {/* <Button 
              onPress={() => setAmountDetail(false)}
              textColor='white'
              buttonColor='#6699CC'
              > Insert </Button> */}
              
            </View>

          : undefined 
        }
      />
     
      <TouchableOpacity 
        
        style = {style.button}
        onPress = {handleSubmit}>
        <Text style= {{color: 'white'}}>Submit</Text>
      </TouchableOpacity>
      
      <View style = {{alignItems: 'center'}}>
      {errAmountMsg && <Text style= {style.warning}> {errAmountMsg} </Text>}
      {errExpenseMsg && <Text style= {style.warning}> {errExpenseMsg} </Text>}
      </View>

      <BottomSheet
        isVisible = {visible}
        modalProps ={{}}
        containerStyle={{color:'black', height: 100}}
      >
        <Text style = {{color:'white', backgroundColor:'grey', fontSize: 20, }}> Please Select a Category </Text>
        <View
          style = {{backgroundColor: 'grey', justifyContent: 'center', alignItems: 'center'}}
        >
        {data.map((item) => 
          
          <TouchableOpacity
          style={{marginVertical: 2, width: '100%', alignItems:'center',}}
          key={item.category}
          onPress={()=> {
            setVisible(false);
            setCategory(item.category);
            }}>
          <Text style={{color:item.color, fontSize: 18, marginVertical: 8}}>{item.category}</Text>
        </TouchableOpacity>,
        {/* <Button 
            key={item.category} 
            textColor={item.color}
            onPress={ ()=> {
              setVisible(false);
              setCategory(item.category);
            }}
          >
            {item.category}
          </Button> */}
        )}   
    
        
        {/* <Button 
          textColor= {'white'}
          onPress={() => {
            setVisible(false);
            setCategory('');  
          }}> Close </Button> */}
        <TouchableOpacity 
            onPress={() => {
              setVisible(false);
              setCategory('');
            }}
            style=
            {{
              width: '100%', 
              alignItems: 'center',
              marginBottom: 30,
              backgroundColor: 'red',
              }}>
              <Text style = 
              {{
                fontSize:20, 
                color: 'white',
                marginVertical: 10

                }}>
                Close
              </Text>
        </TouchableOpacity>
        </View>
      </BottomSheet>

    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: 'blue',
    padding: 20,
    marginHorizontal: 125,
    marginTop: 10,
    borderRadius: 30,
  },

  textInput: {
    height:50,
    color: 'white',
    backgroundColor:'#5A5A5A',
    marginLeft: 10,
    width: '82%'
  },

  warning: {
    color: 'red',
  },
})