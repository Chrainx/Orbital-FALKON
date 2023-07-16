import { View, Text, Modal, ScrollView, Image, Dimensions, StyleSheet, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/auth';
import { ColorPicker, fromHsv } from 'react-native-color-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';

let width = Dimensions.get('window').width

export default function Category() {
  const {user} = useAuth();
  const [newCategory, setNewCategory] = useState('');
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [color, setColor] = useState('#0000FF');
  const [colorVisible, setColorVisible] = useState(false);
  const [error, setError] = useState('')

  async function fetchCategory() {
    let {data} = await supabase.from('category').select('*').order("category", {ascending: true});
    setData(data);
    setRefresh(false);
  }

  useEffect(() => {fetchCategory()}, [])
  useEffect(() => {fetchCategory()}, [refresh])

  const alertDelete = async (item)  => {
    Alert.alert(
      "Every expense belong to " + item +" category will be deleted!",
      "Do you want to proceed?",
      [
        {text: "Cancel"},
        {
          text: "Yes", 
          onPress: () => {handleDelete(item)}
        },
      ]
    );
  }

  const handleDelete = async (item) => {
    await supabase.from('category').delete().eq("category", item);
    await supabase.from("data").delete().eq("category", item);
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
      setError(newCategory.charAt(0).toUpperCase() + newCategory.slice(1).toLowerCase() + " already exist");
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

  
  return (
    <View style = {{flex: 1, backgroundColor: '#f0ffff'}}>
    <Modal
        animationType="slide"
        transparent={true}
        visible={colorVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setColorVisible(!colorVisible);
        }}>
        <View style={{flex: 1, backgroundColor:'white'}}>
            <ColorPicker
              color={color}
              onColorChange={color => setColor(fromHsv(color))}
              style={{ flex: 0.8, marginHorizontal: 25}}
            />
            <Button style={{backgroundColor: '#368ce7', marginHorizontal: '35%', marginTop: 30}}
              onPress={() => setColorVisible(!colorVisible)}>
              <Text style={{color: 'white', fontWeight: 800,}}>CLOSE</Text>
            </Button>
        </View>
      </Modal>
      <View>
        <Image source={require('./tab-icons/MOMA.png')} 
                resizeMode='contain'
                style={{
                  height: width, 
                  width: width, 
                  position: 'absolute', 
                  top: 0,
                  left: 0
                }}/>
      </View>
      <ScrollView
        style = {{flex: 1 }}
      >
      
        {data && data.map(
          item =>
          <View key={item.category} 
                style={{flexDirection:'row', 
                        alignItems:'center', 
                        borderWidth: 2,
                        borderColor: '#1666ba',
                        borderRadius: 8,
                        marginTop: 10,
                        marginHorizontal:5,
                        marginVertical: 2,
                        justifyContent:'space-between',
                        backgroundColor: '#deecfb',
                        
                        
                        }}>
            
            <Text style={{color: item.color, fontSize: 20, marginLeft: 5, fontWeight: 600}}> {item.category} </Text>
            <Button onPress={() => alertDelete(item.category)}><Text  style={{fontWeight: 700,}}>Delete</Text></Button>
            
            
          </View>
        )}
        
        {error !== '' && <Text style={styles.error}>{error} </Text>}
      </ScrollView>

      <View style = {{flexDirection: 'row', width: '100%', justifyContent: 'space-around', alignItems: 'center', marginBottom: 20}}>
        {/* <Button style= {{flex: 1}}labelStyle={{color: color}} onPress={() => setColorVisible(true)}><Text style={{fontWeight: 700}}>COLOR</Text> </Button> */}
        <TouchableOpacity style={{
          backgroundColor: color, 
          width: 30, 
          height: 30, 
          borderRadius: 15, 
          marginLeft: 30,
          marginRight: 25,
          marginTop: 3,
          borderWidth: 3}}
          
          onPress={() => setColorVisible(true)}>

        </TouchableOpacity>
        <TextInput
          style = {{justifyContent: 'flex-end', flex: 2, }}
          mode='outlined'
          maxLength={12}
          placeholder='Insert category'
          value={newCategory}
          onChangeText={setNewCategory}
          keyboardType= {'default'}
        />
        <Button style = {{width: 100}} onPress={handleAdd}><Text style={{fontWeight:700, color: '#368ce7'}}>ADD</Text></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    color: 'red',
    fontSize: 15,
    fontWeight: 600,
    marginVertical: '3%',
    textAlign: 'center'
  },

})