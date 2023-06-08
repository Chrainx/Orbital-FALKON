import { SafeAreaView, View, Text, TextInput} from 'react-native';
import { Button } from 'react-native-paper';

export default function report () {
  return (
    <SafeAreaView>
      <Button> Add Category </Button>
      <Button> Erase all Data </Button>
    </SafeAreaView>
  );
}