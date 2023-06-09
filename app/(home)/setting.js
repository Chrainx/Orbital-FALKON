import { SafeAreaView, View, Text, TextInput} from 'react-native';
import { NewItem } from './newItem';
import { useAuth } from '../../contexts/auth';
import { useEffect, useState } from 'react';

export default function report () {
  const {user} = useAuth();
  const [text, setText] = useState('');

  return (
    <SafeAreaView>
      <Text> Settings </Text>
      <NewItem 
        title= 'Add Category' 
        detail = {<Text style={{color: 'white'}}> {text} </Text>} 
        action = {
          () => 
            {
              if (text == '') {
                setText('a')
              } else {
                setText('')
              }
            }
        }
        />
      <NewItem title= 'Currency Type'/>
      <NewItem title= 'Erase all data' isDestructive/>
      <NewItem title= 'Logout' detail= {<Text style={{color: 'white'}}> 123 </Text>}/>
    </SafeAreaView>
  );
}