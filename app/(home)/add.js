import { StyleSheet, SafeAreaView, View, Text, Image, Alert, TouchableOpacity, Touchable} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { NewAdd } from './newAdd';
import { useAuth } from '../../contexts/auth';
import { useState, useEffect, useCallback, useRef } from 'react';
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
  //const [errExpenseMsg, setErrExpenseMsg] = useState('');
  //const [errAmountMsg, setErrAmountMsg] = useState('');
  //const [errCategoryMsg, setErrCategoryMsg] = useState('');
  const errAmountMsg = useRef("");
  const errCategoryMsg = useRef("");
  const errExpenseMsg = useRef("");
  const isError = useRef(false);

  const alertError = () => {
    Alert.alert(
      "Please Check",
      errExpenseMsg.current + "\n\n" + errCategoryMsg.current + "\n\n" + errAmountMsg.current, 
      [
        {text: "Ok"},
      ]
    );
  }

  const setError = () => {
    var amt = parseFloat(amount).toFixed(2);
    if (expense == "") {
      errExpenseMsg.current = "Expense cannot be empty!";
      isError.current = true;
    }
    if (category == "") {
      errCategoryMsg.current = "Please select a category!\n -You can add your own category in Settings!-";
      isError.current = true;
    }
    if (amount == '') {
      errAmountMsg.current = "Amount cannot be empty!";
      isError.current = true;
    } else if (isNaN(amt)) {
      errAmountMsg.current = "Amount must be a number!";
      isError.current = true;
    } 
    if (amt < 0) {
      errAmountMsg.current = "Amount cannot be a negative value!";
      isError.current = true;
    }
    if (isError.current) {
      alertError();
      return;
    }
  }

  const handleSubmit = async () => {
    errAmountMsg.current = "";
    errCategoryMsg.current = "";
    errExpenseMsg.current = "";
    isError.current = false;
    setError();
    if (isError.current) {
      return;
    }
    // var amt = parseFloat(amount).toFixed(2);
    // if (expense == '') {
    //   setErrExpenseMsg("Expense cannot be empty!");
    //   if (category == "") {
    //     setErrCategoryMsg("Please select a category!\nyou can add your own category in setting!");
    //     if (amount == '') {
    //       setErrAmountMsg("Amount cannot be empty!");
    //       return alertError();
    //     }
    //     if (isNaN(amt)) {
    //       setErrAmountMsg("Amount must be a number!");
    //       return alertError();
    //     } 
    //     if(amt < 0) {
    //       setErrAmountMsg("Amount cannot be a negative value!");
    //       return alertError();
    //     }
    //     return alertError();
    //   }
    //   if (amount == '') {
    //     setErrAmountMsg("Amount cannot be empty!");
    //     return alertError();
    //   }
    //   if (isNaN(amt)) {
    //     setErrAmountMsg("Amount must be a number!");
    //     return alertError();
    //   } 
    //   if(amt < 0) {
    //     setErrAmountMsg("Amount cannot be a negative value!");
    //     return alertError();
    //   }
    //   return alertError();
    // }

    // if (category == '') {
    //   setErrCategoryMsg("Please select a category!\nyou can add your own category in setting!");
    //   if (amount == '') {
    //     setErrAmountMsg("Amount cannot be empty!");
    //     return alertError();
    //   }
    //   if (isNaN(amt)) {
    //     setErrAmountMsg("Amount must be a number!");
    //     return alertError();
    //   }
    //   if(amt < 0) {
    //     setErrAmountMsg("Amount cannot be a negative value!");
    //     return alertError();
    //   }
    //   return alertError();
    // }
      
    // if (amount == '') {
    //   setErrAmountMsg("Amount cannot be empty!");
    //   return alertError();
    // }
    // if (isNaN(amt)) {
    //   setErrAmountMsg("Amount must be a number");
    //   return alertError();
    // }
    // if(amt < 0) {
    //   setErrAmountMsg("Amount cannot be a negative value");
    //   return alertError();
    // }

    var amt = parseFloat(amount).toFixed(2);
    const { error } = await supabase.from('data').
    insert({name: expense, inserted_at: date, category: category, amount: amt, user_id: user.id})
    .select()
    .single();

    setExpense('');
    setAmount('');
    setCategory('');
    setExpenseDetail(false);
    setAmountDetail(false);
    setDate(new Date());
  }

  async function fetchCategory() {
    let {data} = await supabase.from('category').select('*').order("category", {ascending: true});
    setData(data);
  }

  useEffect(() => {fetchCategory()} ,[]);
  useEffect(() => {fetchCategory(), setExpenseDetail(false), setAmountDetail(false)}, [isFocused]);

  return (
    
    <SafeAreaView style={{flex: 1, backgroundColor: '#f0ffff'}}>
      <Text></Text>
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
          ? <Text style={{color: 'white', fontWeight: 800, fontSize: 17, color: '#ff0000'}}> Cancel </Text>
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
                backgroundColor:'#81B1D5'
                }}>
              <TextInput
                placeholder= 'Insert Expense'
                maxLength={15}
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
                right: 10, 
                borderWidth:1, 
                borderColor:'#368cc7', 
                backgroundColor:'#368cc7', borderRadius: 25}} 
                onPress={() => setExpenseDetail(false)}>

                <Text style = {{
                  color: 'white', 
                  fontSize:15, 
                  marginVertical: 5, 
                  marginHorizontal:8,
                  fontWeight: 700
                  }}>
                    Insert
                </Text>
              </TouchableOpacity>
              
              {/* <Button 

              onPress={() => setExpenseDetail(false)}
              textColor='white'
              buttonColor='#6699CC'
              > 
              Insert </Button>   */}
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
          ? <Text style={{color: 'white', fontWeight: 800, fontSize: 17, color: '#ff0000'}}> Cancel </Text>
          : amount != ''
          ? <Text style={{color: 'white'}}> {amount} </Text>
          : <Image source={require('./tab-icons/arrowdown.png')} resizeMode="contain" style={{ width: 25, height: 25, }}/>
        }
        action= { () => 
          { 
            if (amountDetail) {
              setAmount('');
              setAmountDetail(false);
            } else {
              setAmountDetail(true);
            }
          }
        }
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
                backgroundColor:'#81B1D5'
                  }}
            >
              <TextInput
                placeholder= 'Insert Amount'
                //textColor='white'
                placeholderTextColor='white'
                value={amount} 
                onChangeText={setAmount}
                style={style.textInput}
              />

              
              <TouchableOpacity style=
              {{
                right: 10, 
                borderWidth:1, 
                borderColor:'#368cc7', 
                backgroundColor:'#368cc7', borderRadius: 25}} 
                onPress={() => setAmountDetail(false)}>

                <Text style = {{
                  color: 'white', 
                  fontSize:15, 
                  marginVertical: 5, 
                  marginHorizontal:8,
                  fontWeight: 700
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
      <View style = {{alignItems: 'center'}}>
      <TouchableOpacity 
        style = {style.submit}
        onPress = {handleSubmit}>
        
        <Text style= {{color: 'white', fontWeight: 800}}> SUBMIT </Text>
        
      </TouchableOpacity>
      </View>
      
      {/* <View style = {{alignItems: 'center'}}>
      {errAmountMsg && <Text style= {style.warning}> {errAmountMsg} </Text>}
      {errExpenseMsg && <Text style= {style.warning}> {errExpenseMsg} </Text>}
      {errCategoryMsg && <Text style= {style.warning}> {errCategoryMsg} </Text>}
      </View> */}

      <BottomSheet
        isVisible = {visible}
        modalProps ={{}}
        containerStyle={{color:'black', height: 100}}
      >
        <Text style = {{color:'white', borderWidth: 2, borderColor: '#1666ba', backgroundColor:'#368cc7', fontSize: 20, fontWeight: 700, textAlign:'center', paddingVertical: 5}}> Please Select a Category </Text>
        <View
          style = {{backgroundColor: '#A0C0D4', borderWidth: 0, justifyContent: 'center', alignItems: 'center'}}
        >
        {data && data.map((item) => 
          
        <TouchableOpacity
          style={{marginVertical: 0, paddingVertical: 2,  width: '100%', alignItems:'center', borderWidth: 1, borderColor: '#2080d0'}}
          key={item.category}
          onPress={()=> {
            setVisible(false);
            setCategory(item.category);
            }}>
          <Text style={{color: item.color, fontSize: 18, marginVertical: 8}}>{item.category}</Text>
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
              backgroundColor: '#dd0520',
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
  submit: {
    alignItems: 'center',
    backgroundColor: '#368cc7',
    padding: 20,
    width: 150,
    marginTop: 10,
    borderRadius: 30,
  },

  textInput: {
    height:50,
    color: 'white',
    backgroundColor:'#81B1D5',
    marginLeft: 10,
    width: '82%'
  },

  warning: {
    color: 'red',
  },
})