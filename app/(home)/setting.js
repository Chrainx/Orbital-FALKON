import { SafeAreaView, View, Text, Image, } from 'react-native';
import { NewItem } from './newItem';
import { TextInput, Button } from 'react-native-paper';
import { useAuth } from '../../contexts/auth';
import { useState } from 'react';

export default function report () {
  const {user} = useAuth();
  const [newCategory, setNewCategory] = useState('');
  const [CategoryDetail, setCategoryDetail] = useState(false);
  const [newCurrency, setNewCurrency] = useState('');
  const [CurrencyDetail, setCurrencyDetail] = useState(false);

  return (
    <SafeAreaView>
        <Text> Settings </Text>
        <NewItem
          title = 'Add Category'
          icon = { 
            CategoryDetail
            ? <Text style={{color: 'red'}}> Cancel </Text> 
            : <Image source={require('./tab-icons/addCategory.png')} resizeMode="contain" style={{ width: 25, height: 25, }}/>
          }
          detail = {
            CategoryDetail 
            ? <View style = {{flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent:'space-between', backgroundColor:'black'}}>
              <TextInput
                placeholder= 'Insert A New Category'
                value={newCategory} 
                onChangeText={setNewCategory}
                style={{ 
                  height:50,
                  color: 'white',
                  backgroundColor:'black',
                  marginLeft: 10,
                  width: '82%'
                }}
              /> 
              <Button onPress={() => undefined}> + </Button> 
            </View>
            : undefined}
          action = {() => {
            if (CategoryDetail) {
              setCategoryDetail(false);
            } else {
              setCategoryDetail(true)}
            }
          }
        />
        <NewItem 
            title= 'Test' 
        />
        <NewItem 
          title= 'Currency Type' 
          icon={CurrencyDetail
            ? <Text style={{color: 'red'}}> Cancel </Text> 
            : <Image source={require('./tab-icons/currency.png')} resizeMode="contain" style={{ width: 25, height: 25, }}/>
          }
          detail = {
            CurrencyDetail 
            ? <View style = {{flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent:'space-between', backgroundColor:'black'}}>
              <TextInput
                placeholder= 'Mau dibikin drop-down?'
                value={newCurrency} 
                onChangeText={setNewCurrency}
                style={{ 
                  height:50,
                  color: 'white',
                  backgroundColor:'black',
                  marginLeft: 10,
                  width: '82%'
                }}
              /> 
              <Button onPress={() => undefined}> + </Button> 
            </View>
            : undefined}
          action = {() => {
            if (CurrencyDetail) {
              setCurrencyDetail(false);
            } else {
              setCurrencyDetail(true)}
            }
          }
        />
        <NewItem 
          title= 'Erase all data' 
          isDestructive 
          icon={CategoryDetail
            ? <Text style={{color: 'red'}}> Cancel </Text> 
            : <Image source={require('./tab-icons/trashcan.png')} resizeMode="contain" style={{ width: 25, height: 25, }}/>
          }
        
        />
        <NewItem 
          title= 'Logout' 
          icon= {CategoryDetail
            ? <Text style={{color: 'red'}}> Cancel </Text> 
            : <Image source={require('./tab-icons/logout.png')} resizeMode="contain" style={{ width: 20, height: 20, }}/>
          }
        />
    </SafeAreaView>
  );
}