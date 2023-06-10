import { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, TouchableOpacity, RefreshControl} from 'react-native';

export const Refresh = props => {
  const [refresh, setRefresh] = useState(true);
  props.isRefresh ? setTrue(true) : setRefresh
  return refresh;
}