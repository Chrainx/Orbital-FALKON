import { SafeAreaView, View, Text} from 'react-native';
import { TextInput } from 'react-native-paper';
import { NewAdd } from './newAdd';
import { useState, useEffect } from 'react';
import { useIsFocused } from "@react-navigation/native";

export default function add () {
  const [expense, setExpense] = useState('');
  const [expenseDetail, setExpenseDetail] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {}, [isFocused]);

  return (
    <SafeAreaView>
      <Text> Add </Text>
      <NewAdd
        title= 'Expense'
        icon= {
          (expenseDetail || expense != '')
          ? <Text style={{color: 'white'}}> {expense} </Text>
          : <Text style={{color: 'white'}}> Gambar Arrow ke bawah </Text>
        }
        action= {() => setExpenseDetail(!expenseDetail)}
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
              </View>
          : undefined 
        }

      />
    </SafeAreaView>
  );
}