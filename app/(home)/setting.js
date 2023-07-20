import { SafeAreaView, Text, Image, Alert, StyleSheet} from 'react-native';
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

  const alertErase = () => {
      Alert.alert(
        "Are you sure you want to erase all data?",
        "This action is irreversible.", 
        [
          {text: "Cancel"},
          {
            text: "Erase", 
            onPress: async () => { 
              await supabase.from('data').delete().eq("user_id", user.id);
              await supabase.from('category').delete().eq("user_id", user.id);
              await supabase.from('info').delete().eq("user_id", user.id)
            } 
          },
        ]
      );
  }

  const alertDelete = () => {
    Alert.alert(
      "Are you sure you want to delete your account?",
      "This action is irreversible.", 
      [
        {text: "Cancel"},
        {
          text: "Delete", 
          onPress: async () => { 
            await supabase.from('data').delete().eq("user_id", user.id);
            await supabase.from('category').delete().eq("user_id", user.id);
            await supabase.from('info').delete().eq("user_id", user.id);
            await supabase.auth.admin.deleteUser(user.id);
            await supabase.auth.signOut();
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
    <SafeAreaView style={{flex: 1, backgroundColor:'#f0ffff'}}>
      <NewSetting
        title = 'Add Category'
        icon = {
          <Image 
            source={require('./tab-icons/addCategory.png')}
            resizeMode="contain"
            style={style.picture}
        />
        }
        action = {() => 
          {navigation.navigate("Category");}
        }
        />
        <NewSetting
          title= 'Erase all data' 
          isDestructive 
          icon={ <Image source={require('./tab-icons/trashcan.png')} 
          resizeMode="contain" 
          style={style.picture}/>}
          action = {alertErase}
        />
        <NewSetting
          title= 'Logout' 
          icon= {<Image source={require('./tab-icons/logout.png')} 
          resizeMode="contain" 
          style={{ width: 20, height: 20, }}/>}
          action= {alertLogout} 
        />
        <NewSetting
          title= 'Delete Your Account' 
          isDestructive 
          icon={ <Image source={require('./tab-icons/trashcan.png')} 
          resizeMode="contain" 
          style={style.picture}/>}
          action = {alertDelete}
        />
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  picture: {
    width: 25, 
    height: 25,
  },

})