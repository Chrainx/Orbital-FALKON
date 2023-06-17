import { FlatList, View, Text, ScrollView} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/auth';

export default function Category() {
  const {user} = useAuth();
  const [newCategory, setNewCategory] = useState('');
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  async function fetchCategory() {
    let {data} = await supabase.from('category').select('category');
    setData(data);
    setRefresh(false);
  }

  const handleDelete = async (item) => {
    const { error } = await supabase.from('category').delete().eq("category", item);
    setRefresh(true);
  }

  const handleAdd = async () => {
    const { error } = await supabase.from('category')
      .insert({category: newCategory, user_id: user.id})
      .select()
      .single();
    setRefresh(true);
    setNewCategory('');
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
            <Text> {item.category} </Text>
            <Button onPress={() => handleDelete(item.category)}> - </Button>
          </View>
        )}
      </ScrollView>

      <View style = {{flexDirection: 'row', width: '100%', justifyContent: 'space-around', alignItems: 'center'}}>
        <Text> color </Text>
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