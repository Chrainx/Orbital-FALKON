import { View, Text, Modal, ScrollView} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/auth';
import ColorPicker from 'react-native-wheel-color-picker'

export default function Category() {
  const {user} = useAuth();
  const [newCategory, setNewCategory] = useState('');
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [color, setColor] = useState('#000000');
  const [colorVisible, setColorVisible] = useState(false);

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
    console.log(color);
    const { error } = await supabase.from('category')
      .insert({category: newCategory, user_id: user.id, color: color})
      .select()
      .single();
    setRefresh(true);
    setNewCategory('');
    setColor("#000000")
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
        <View style = {{ 
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
            <ColorPicker
              style = {{flex: 1}}
              ref={r => {this.picker = r}}
              color={color}
              onColorChange={(color) => setColor(color)}
            />
            <Button
              style={{flex: 1}}
              onPress={() => setColorVisible(!colorVisible)}>
              <Text>Close</Text>
            </Button>
        </View>
      </Modal>
      <ScrollView
        style = {{flex: 1}}
      >
        {data.map(
          item =>
          <View key={item.category} style={{flexDirection:'row'}}>
            <Text style={{color: item.color}}> {item.category} </Text>
            <Button onPress={() => handleDelete(item.category)}> - </Button>
          </View>
        )}
      </ScrollView>

      <View style = {{flexDirection: 'row', width: '100%', justifyContent: 'space-around', alignItems: 'center'}}>
        <Button labelStyle={{color: color}} onPress={() => setColorVisible(true)}> Color </Button>
        <TextInput
          style = {{justifyContent: 'flex-end'}}
          placeholder='Insert category'
          value={newCategory}
          onChangeText={setNewCategory}
        />
        <Button onPress={handleAdd}> ADD </Button>
      </View>
    </View>
  );
}