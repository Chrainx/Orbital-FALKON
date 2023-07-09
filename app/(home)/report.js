import React, { Component, useState, useEffect, useRef} from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Image, Modal, Alert, SafeAreaView} from "react-native";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { useAuth } from "../../contexts/auth";
import { supabase } from "../../lib/supabase";
import { useIsFocused } from "@react-navigation/native";
import { SelectList, MultipleSelectList } from 'react-native-dropdown-select-list'
import { MaskedViewComponent } from "react-native";
import Expense from "./expense";
import PieChart from 'react-native-pie-chart'


export default function Report() { 

    //For Pie Chart
  const widthAndHeight = 250
  const series = [123, 321, 123, 789, 537]
  const sliceColor = ['#fbd203', '#ffb300', '#ff9100', '#ff6c00', '#ff3c00']

  //For Average
  const averagePick = [
    {key:'1', value:'Today'},
    {key:'2', value:'This Week'},
    {key:'3', value:'This Month'},
    {key:'4', value:'This Year'},
    {key:'5', value:'All'},
  ]
  
  // For data about every expense
  const [data, setData] = useState([]);
  
  // For remove duplicate date 
  const [date, setDate] = useState([]);

  // For Category
  const [category, setCategory] = useState([]);

  // For find the total for all spending
  const total = useRef(0);

  // For the loading indicator
  const [loading, setLoading] = useState(false);

  // For authentication
  const {user} = useAuth();

  // For refreshing
  const [refresh, setRefresh] = useState(false);
  const isFocused = useIsFocused();

  // For average
  const [averageSetting, setAverageSetting] = useState("All");
  const [average, setAverage] = useState(0);


  async function fetchData() {
    setLoading(true);
    setRefresh(true);
    fetchExpense();
    fetchCategory();
    setRefresh(false);
    setLoading(false);
  }

  async function fetchExpense() {
    let {data} = await supabase.from('data').select("*").order("inserted_at", {ascending: false});
    setData(data);
    const newArr = [];
    if (data.length == 0) {
      total.current = 0;
      setAverage(0);
    } else {
      total.current = data.reduce((a, b) => a + b.amount, 0);
      newArr.push(new Date(data[0].inserted_at).toDateString());
      for (var i = 1; i < data.length; i++) {
        if (newArr[newArr.length - 1] !== new Date(data[i].inserted_at).toDateString()) {
          newArr.push(new Date(data[i].inserted_at).toDateString())
        }
      }
      setDate(newArr);
      if (averageSetting == "All") {
        setAverage(total.current);
      } else if (averageSetting == "Today") {
        setAverage(data.filter(x => new Date(x.inserted_at).toDateString() == new Date().toDateString()).reduce((a, b) => a + b.amount, 0));
      } else if (averageSetting == "This Week") {
        //setAverage(data.filter(x => new Date(x.inserted_at).toDateString()))
      } else if (averageSetting == "This Month") {
        setAverage(data.filter(x => new Date(x.inserted_at).getMonth() == new Date().getMonth() && new Date(x.inserted_at).getFullYear() == new Date().getFullYear()).reduce((a, b) => a + b.amount, 0));
      } else if (averageSetting == "This Year") {
        setAverage(data.filter(x => new Date(x.inserted_at).getFullYear() == new Date().getFullYear()).reduce((a, b) => a + b.amount, 0));
      }
    }
  }
  async function fetchCategory() {
    let {data} = await supabase.from('category').select('*');
    setCategory(data);
  }

  useEffect(() => {fetchData()}, []);
  useEffect(() => {if(isFocused) {fetchData()}}, [isFocused]);
  useEffect(() => {if(refresh) {fetchData()}}, [refresh]);


  return (
    <View style={{flex: 1, flexDirecton: 'row'}}>

      <View>
        <View style={{flexDirection: 'row', justifyContent: "space-around"}}> 
          <Text> Total for: </Text>
          <SelectList
            setSelected={(val) => {setAverageSetting(val); setRefresh(true)}}
            data={averagePick}
            save="value"
            defaultOption={{key:'5', value:'All'}}
          />
          <Text> SGD {(average).toFixed(2)}</Text>
        </View>
        <Text> Yang this week masih salah, trus kyknya yang gw buat ni cocoknya di expense yang paling bawah </Text>
      </View>


      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Doughnut</Text>
          <PieChart
            widthAndHeight={widthAndHeight}
            series={series}
            sliceColor={sliceColor}
            coverRadius={0.45}
            coverFill={'#FFF'}
          />
        </View>
      </ScrollView>


      {category && category.map(x => 
        <View key={x.id}>
          <Text> {x.category} </Text>
          {data 
            ? <Text> {(100 * (data.filter(y => y.category == x.category).reduce((a, b) => a + b.amount, 0))/total.current).toFixed(2)} % </Text>
            : <Text> 0 </Text>
          }
        </View>
      )}
      {loading && <ActivityIndicator />}
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    margin: 10,
  },
})