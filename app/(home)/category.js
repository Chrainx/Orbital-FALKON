import { View, Text, Modal, ScrollView} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/auth';
import { ColorPicker, fromHsv } from 'react-native-color-picker';


export default function Category() {
  const {user} = useAuth();
  const [newCategory, setNewCategory] = useState('');
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [color, setColor] = useState('#0000FF');
  const [colorVisible, setColorVisible] = useState(false);
  const [error, setError] = useState('')

  async function fetchCategory() {
    let {data} = await supabase.from('category').select('*');
    setData(data);
    setRefresh(false);
  }

  const handleDelete = async (item) => {
    const { error } = await supabase.from('category').delete().eq("category", item);
    setRefresh(true);
  }

  const handleAdd = async () => {
    setError('');
    if (newCategory == '') {
      setError("New Category cannot be empty");
      return;
    }
    let { data } = await supabase.from('category').select('category').eq('category', newCategory.charAt(0).toUpperCase() + newCategory.slice(1).toLowerCase())
    if (data.length == 1) {
      setError(newCategory + " already exist");
      return;
    }
    const { error } = await supabase.from('category')
      .insert({category: (newCategory.charAt(0).toUpperCase() + newCategory.slice(1).toLowerCase()), user_id: user.id, color: color})
      .select()
      .single();
    setRefresh(true);
    setNewCategory('');
    setColor("#0000FF")
  }


  useEffect(() => {fetchCategory()}, [])
  useEffect(() => {fetchCategory()}, [refresh])

  
  return (
    <View style = {{flex: 1}}>
    <Modal
        animationType="slide"
        transparent={true}
        visible={colorVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setColorVisible(!colorVisible);
        }}>
        <View style={{flex: 1, backgroundColor:'white'}}>
            <Text style={{marginTop: 5}}> Please select a color</Text>
            <ColorPicker
              color={color}
              onColorChange={color => setColor(fromHsv(color))}
              style={{ flex: 1 }}
            />
            <Button 
              onPress={() => setColorVisible(!colorVisible)}>
              <Text>Close</Text>
            </Button>
        </View>
      </Modal>
      <ScrollView
        style = {{flex: 1}}
      >
        {data && data.map(
          item =>
          <View key={item.category} 
                style={{flexDirection:'row', 
                        alignItems:'center', 
                        borderWidth: '2',
                        borderColor: 'black',
                        borderRadius: 8,
                        marginTop: 10,
                        marginHorizontal:5,
                        marginVertical: 2,
                        justifyContent:'space-between',
                        backgroundColor: 'lavender',
                        
                        
                        }}>
            
            <Text style={{color: item.color, fontSize:'20', marginLeft: 5}}> {item.category} </Text>
            <Button onPress={() => handleDelete(item.category)}> Delete </Button>
            
            
          </View>
        )}
        
        {error !== '' && <Text> {error} </Text>}
      </ScrollView>

      <View style = {{flexDirection: 'row', width: '100%', justifyContent: 'space-around', alignItems: 'center'}}>
        <Button labelStyle={{color: color}} onPress={() => setColorVisible(true)}> Color </Button>
        <TextInput
          style = {{justifyContent: 'flex-end'}}
          placeholder='Insert category'
          value={newCategory}
          onChangeText={setNewCategory}
          keyboardType= {'default'}
        />
        <Button onPress={handleAdd}> ADD </Button>
      </View>
    </View>
  );
}