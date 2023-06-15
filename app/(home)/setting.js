import { SafeAreaView, View, Text, Image, Alert } from 'react-native';
import { NewSetting } from './newSetting';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../../contexts/auth';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

// Use Modal to choose Category
export default function setting () {
  const {user} = useAuth();
  const [loading, setLoading] = useState(false);
  const [errCategoryMsg, setErrCategoryMsg] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [CategoryDetail, setCategoryDetail] = useState(false);
  const [newCurrency, setNewCurrency] = useState('');
  const [CurrencyDetail, setCurrencyDetail] = useState(false);

  const handleAdd = async () => {
    setErrCategoryMsg('');
    setNewCategory('');
    if (newCategory == '') {
      setErrCategoryMsg("New category cannot be empty");
      setCategoryDetail(false);
      return;
    }
    setLoading(true);
    const { data, count, error } = await supabase.from('category').select('*', {count: 'exact'}).eq("user_id", user.id).eq("category", newCategory);
    if (count != 0) {
      setErrCategoryMsg(newCategory + " already exist");
      setLoading(false);
      setCategoryDetail(false);
      return;
    } else {
      const { error } = await supabase.from('category').
      insert({inserted_at: new Date(), category: newCategory, user_id: user.id})
      .select();
    }
    setLoading(false);
    if (error != null) {
      setErrCategoryMsg(error.message);
      setCategoryDetail(false);
      return;
    }
    if (errCategoryMsg == '') {
      setCategoryDetail(false);
    }
  }
  
  const alertDelete = () => {
      Alert.alert(
        "Are you sure you want to erase all data?",
        "This action is irreversible.", 
        [
          {text: "Cancel"},
          {
            text: "Delete", 
            onPress: async () => { 
              await supabase.from('data').delete().eq("user_id", user.id);
              await supabase.from('category').delete().eq("user_id", user.id);
            } 
          },
        ]
      );
  }
  const alertLogout = () => {
    Alert.alert(
      "Are you sure want to logout?",
      "", 
      [
        {text: "Cancel"},
        {
          text: "Logout", 
          onPress: async () => { 
            supabase.auth.signOut();
          } 
        },
      ]
    );
}

  return (
    <SafeAreaView>
        <Text> Settings </Text>
        <NewSetting
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
            setErrCategoryMsg('');
            setCategoryDetail(!CategoryDetail);
            }
          }
        />
        {errCategoryMsg !== '' && <Text style={{color:'red'}}> {errCategoryMsg}! </Text>}
        <NewSetting 
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
          action = {() => {setCurrencyDetail(!CurrencyDetail)}}
        />
        <NewSetting
          title= 'Erase all data' 
          isDestructive 
          icon={ <Image source={require('./tab-icons/trashcan.png')} resizeMode="contain" style={{ width: 25, height: 25, }}/>}
          action = {alertDelete}
        />
        <NewSetting
          title= 'Logout' 
          icon= {<Image source={require('./tab-icons/logout.png')} resizeMode="contain" style={{ width: 20, height: 20, }}/>}
          action= {alertLogout} 
        />
         {loading && <ActivityIndicator />}
    </SafeAreaView>
  );
}