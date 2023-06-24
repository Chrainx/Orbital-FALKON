import { SafeAreaView, View, Text, Image, Alert, TouchableOpacity} from 'react-native';
import { NewSetting } from './newSetting';
import { TextInput, Button } from 'react-native-paper';
import { useAuth } from '../../contexts/auth';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigation } from '@react-navigation/native';


// Use Modal to choose Category
export default function Setting () {
  const {user} = useAuth();
  const [newCurrency, setNewCurrency] = useState('');
  const [CurrencyDetail, setCurrencyDetail] = useState(false);
  const navigation = useNavigation();

  
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
              await supabase.from('info').delete().eq("user_id", user.id)
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
          icon = {<Image source={require('./tab-icons/addCategory.png')} resizeMode="contain" style={{ width: 25, height: 25, }}/>
          }
          action = {
            () => {
            navigation.navigate("Category");

            }
          }
        />
        <NewSetting 
          title= 'Currency Type' 
          icon={CurrencyDetail
            ? <Text style={{color: 'red'}}> Cancel </Text> 
            : <Image source={require('./tab-icons/currency.png')} resizeMode="contain" style={{ width: 25, height: 25, }}/>
          }
          detail = {
            CurrencyDetail 
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
                placeholder= 'Choose your currency'
                textColor='white'
                placeholderTextColor='white'
                value={newCurrency} 
                onChangeText={setNewCurrency}
                style={{ 
                  height:50,
                  color: 'white',
                  backgroundColor:'#5A5A5A',
                  marginLeft: 10,
                  width: '82%'
                }}
              />

            <TouchableOpacity style=
              {{
                marginRight: 20, 
                borderWidth:1, 
                borderColor:'#6699CC', 
                backgroundColor:'#6699CC', borderRadius: 25}} 
                onPress={() => undefined}>

                <Text style = {{
                  color: 'white', 
                  fontSize:15, 
                  marginVertical: 5, 
                  marginHorizontal:8,
                  }}>
                    Insert
                </Text>
              </TouchableOpacity>

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
    </SafeAreaView>
  );
}