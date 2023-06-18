import { StyleSheet, SafeAreaView, View, Text, Image, FlatList, TouchableOpacity} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { NewAdd } from './newAdd';
import { useAuth } from '../../contexts/auth';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useIsFocused } from "@react-navigation/native";
import { BottomSheet } from '@rneui/themed';

export default function Add () {
  //For supabase
  const {user} = useAuth();

  //For Refresh
  const isFocused = useIsFocused()
  
  //For Expense
  const [expense, setExpense] = useState('');
  const [expenseDetail, setExpenseDetail] = useState(false);

  //For Category
  const [category, setCategory] = useState('');
  const [categoryDetail, setCategoryDetail] = useState(false);
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
      insert({name: expense, inserted_at: new Date(), category: category, amount: amt, user_id: user.id})
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
              <Button 

              onPress={() => setExpenseDetail(false)}
              textColor='white'
              buttonColor='#6699CC'
              > 
              Insert </Button> 
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
              
              <Button 
              onPress={() => setAmountDetail(false)}
              textColor='white'
              buttonColor='#6699CC'
              > Insert </Button>
              
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
        <Text style = {{color:'white', backgroundColor:'black'}}> Please Select a Category </Text>
        <View
          style = {{backgroundColor: 'black', justifyContent: 'center', alignItems: 'center'}}
        >
        {data.map((item) => 
          <Button 
            key={item.category} 
            textColor={item.color}
            onPress={ ()=> {
              setVisible(false);
              setCategory(item.category);
            }}
          > 
            {item.category}
          </Button> 
        )}        
        <Button 
          textColor= {'white'}
          onPress={() => {
            setVisible(false);
            setCategory('');  
          }}> Close </Button>
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