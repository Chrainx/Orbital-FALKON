import { StyleSheet, SafeAreaView, View, Text, Image, FlatList, TouchableOpacity} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { NewAdd } from './newAdd';
import { Picker } from '@react-native-picker/picker'
import { useAuth } from '../../contexts/auth';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useIsFocused } from "@react-navigation/native";

export default function add () {
  //For supabase
  const {user} = useAuth();

  //For Refresh
  const [refresh, setRefresh] = useState(false);
  const isFocused = useIsFocused()
  
  //For Expense
  const [expense, setExpense] = useState('');
  const [expenseDetail, setExpenseDetail] = useState(false);

  //For Category
  const [category, setCategory] = useState('');
  const [categoryDetail, setCategoryDetail] = useState(false);

  //For Amount
  const [amount, setAmount] = useState('');
  const [amountDetail, setAmountDetail] = useState(false);

  //fetching
  const [data, setData] = useState([]);

  //For No
  const [count, setCount] = useState(0);

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
    const { error } = await supabase.from('data').
      insert({name: expense, inserted_at: new Date(), category: 'None', amount: amt, user_id: user.id, no: count + 1})
      .select()
      .single();

    setExpense('');
    setAmount('');
    setExpenseDetail(false);
    setAmountDetail(false);
    setRefresh(true);
  }

  async function getCount() {
    let {count} = await supabase.from('data').select('*', {count: 'exact'});
    setCount(count);
  }

  async function fetchCategory() {
    let {data} = await supabase.from('category').select('category');
    setData(data);
    console.log(data);
  }

  useEffect(() => {fetchCategory(), getCount()} ,[]);
  useEffect(() => {fetchCategory()}, [isFocused]);
  useEffect(() => {
    if (refresh) {
      getCount()
    }
  }, [refresh]);

  const renderCategoryList = () => {
    return data.map(
      (item, index) => {
        return <Picker key={index} label={item.category} value={item.category}/>}
    );
  }

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
          ? <View>
            <TouchableOpacity
              onPress={() => onOpen('category')}>
              <Text> {category} </Text>
            </TouchableOpacity>
            <Picker
              selectedValue={category}
              onValueChange={item => setCategory(item)}
            >
            {renderCategoryList()}
            </Picker>
          </View>
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