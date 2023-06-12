import { StyleSheet, SafeAreaView, View, Text, Image, FlatList, TouchableOpacity} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { NewAdd } from './newAdd';
import { useAuth } from '../../contexts/auth';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useIsFocused } from "@react-navigation/native";

export default function add () {
  const {user} = useAuth();
  const [expense, setExpense] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseDetail, setExpenseDetail] = useState(false);
  const [categoryDetail, setCategoryDetail] = useState(false);
  const [amountDetail, setAmountDetail] = useState(false);
  const [data, setData] = useState([]);
  const isFocused = useIsFocused();
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
    const { error } = await supabase.from('data').
      insert({name: expense, inserted_at: new Date(), category: null, amount: amt, user_id: user.id})
      .select()
      .single();

    setExpense('');
    setAmount('');
    setExpenseDetail(false);
    setAmountDetail(false);
  }




  async function fetchCategory() {
    let {data} = await supabase.from('category').select('category');
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
          ? <View style = {{flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent:'space-between', backgroundColor:'black'}}>
              <TextInput
                placeholder= 'Insert Expense'
                value={expense} 
                onChangeText={setExpense}
                style={{ 
                  height:50,
                  color: 'white',
                  backgroundColor:'black',
                  marginLeft: 10,
                  width: '82%'
                }}
              /> 
              <Button onPress={() => setExpenseDetail(false)}> insert </Button> 
            </View>

          : undefined 
        }
      />
      <NewAdd
        title= 'Category'
        icon={
          categoryDetail 
          ? <Image source={require('./tab-icons/arrowup.png')} resizeMode="contain" style={{ width: 25, height: 25, }}/>
          : <Image source={require('./tab-icons/arrowdown.png')} resizeMode="contain" style={{ width: 25, height: 25, }}/>
        }
        action={ () => setCategoryDetail(!categoryDetail)}
        detail={ 
          categoryDetail 
          ? <FlatList
            data={ data }
            style= {{flexDirection: 'row', backgroundColor: 'black'}}
            renderItem = {
              ({item}) => <Text style={{color: 'white', width: 300, alignItems: 'center'}}> {item.category} </Text>
            }
          />
          : undefined
        }
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
          ? <View style = {{flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent:'space-between', backgroundColor:'black'}}>
              <TextInput
                placeholder= 'Insert Amount'
                value={amount} 
                onChangeText={setAmount}
                style={style.textInput}
              /> 
              <Button onPress={() => setAmountDetail(false)}> insert </Button> 
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
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 10,
  },

  textInput: {
    height:50,
    color: 'white',
    backgroundColor:'black',
    marginLeft: 10,
    width: '82%'
  },

  warning: {
    color: 'red',
  },
})