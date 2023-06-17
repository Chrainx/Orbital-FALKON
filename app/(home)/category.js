import { FlatList, View, Text, ScrollView} from 'react-native';
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
  const [color, setColor] = useState('');

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
    setColor("#FFFFFF")
  }


  useEffect(() => {fetchCategory()}, [])
  useEffect(() => {fetchCategory()}, [refresh])

  
  return (
    <View style = {{flex: 1}}>
      <ScrollView
        style = {{flex: 1}}
      >
        {data.map(
          item =>
          <View key={item.category} style={{flexDirection:'row'}}>
            <Text style={{backgroundColor: item.color}}> {item.category} </Text>
            <Button onPress={() => handleDelete(item.category)}> - </Button>
          </View>
        )}
      </ScrollView>

      <View style = {{flexDirection: 'row', width: '100%', justifyContent: 'space-around', alignItems: 'center'}}>
        <ColorPicker
          ref={r => {this.picker = r}}
          color={color}
          onColorChange={(color) => setColor(color)}
        />
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