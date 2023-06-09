import { SafeAreaView, View, Text, Image, } from 'react-native';
import { NewItem } from './newItem';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../../contexts/auth';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function report () {
  const {user} = useAuth();
  const [loading, setLoading] = useState(false);
  const [errCategoryMsg, setErrCategoryMsg] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [CategoryDetail, setCategoryDetail] = useState(false);
  const [newCurrency, setNewCurrency] = useState('');
  const [CurrencyDetail, setCurrencyDetail] = useState(false);

  const handleAdd = async () => {
    if (newCategory == '') {
      setErrCategoryMsg("New category cannot be empty");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('category').
      insert({inserted_at: new Date(), category: newCategory, user_id: user.id})
      .select()
      .single();
    setLoading(false);
    if (error != null) {
      setErrCategoryMsg(error.message);
      return;
    }
  }

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
              <Button onPress={handleAdd}> + </Button> 
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
        {errCategoryMsg !== '' && <Text style={{color:'red'}}> {errCategoryMsg}! </Text>}
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
          icon={ <Image source={require('./tab-icons/trashcan.png')} resizeMode="contain" style={{ width: 25, height: 25, }}/>}
        />
        <NewItem 
          title= 'Logout' 
          icon= {<Image source={require('./tab-icons/logout.png')} resizeMode="contain" style={{ width: 20, height: 20, }}/>}
          action= {() => supabase.auth.signOut()} 
        />
         {loading && <ActivityIndicator />}
    </SafeAreaView>
  );
}