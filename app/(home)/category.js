import { SafeAreaView, View, Text, ScrollView} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useState, useEffect } from 'react';

export default function Category() {
  const [newCategory, setNewCategory] = useState('');
  return (
    <View style = {{flex: 1}}>
      <ScrollView
        style = {{flex: 1}}

      >

      </ScrollView>
      <View style = {{flexDirection: 'row', width: '100%', justifyContent: 'space-around', alignItems: 'center'}}>
        <Text> color </Text>
        <TextInput
          style = {{justifyContent: 'flex-end'}}
          placeholder='Insert a category'
          onChangeText={setNewCategory}
        />
        <Text> ADD </Text>
      </View>
    </View>
  );
}