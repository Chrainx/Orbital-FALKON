import { SafeAreaView, View, Text} from 'react-native';
import { NewItem } from './newItem';
import { TextInput, Button } from 'react-native-paper';
import { useAuth } from '../../contexts/auth';
import { useState } from 'react';

export default function report () {
  const {user} = useAuth();
  const [newCategory, setNewCategory] = useState('');
  const [CategoryDetail, setCategoryDetail] = useState(false);

  return (
    <SafeAreaView>
        <Text> Settings </Text>
        <NewItem
          title = 'Add Category'
          icon = { 
            CategoryDetail
            ? <Text style={{color: 'red'}}> Cancel </Text> 
            : <Text style ={{color: 'white'}}> Add/bisa ganti ke gambar pake Image </Text>
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
          icon={<Text style={{color: 'white'}}> Gambar Currency </Text>}
        />
        <NewItem 
          title= 'Erase all data' 
          isDestructive 
          icon={<Text style={{color: 'white'}}>  Gambar tongsampah untuk delete</Text>} 
        />
        <NewItem 
          title= 'Logout' 
          icon= {<Text style={{color: 'white'}}> Gambar Logout </Text>}
        />
    </SafeAreaView>
  );
}