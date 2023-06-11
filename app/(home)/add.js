import { SafeAreaView, View, Text, FlatList} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { NewAdd } from './newAdd';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useIsFocused } from "@react-navigation/native";

export default function add () {
  const [expense, setExpense] = useState('');
  const [expenseDetail, setExpenseDetail] = useState(false);
  const [categoryDetail, setCategoryDetail] = useState(false);
  const [data, setData] = useState([]);
  const isFocused = useIsFocused();

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
          : <Text style={{color: 'white'}}> Gambar Arrow ke bawah </Text>
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
          ? <Text style={{color: 'white'}}> Gambar Arrow ke atas </Text>
          : <Text style={{color: 'white'}}> Gambar Arrow ke bawah </Text>
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
    </SafeAreaView>
  );
}