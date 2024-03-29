import React, { Component, useState, useEffect, useRef} from "react";
import { Dimensions, View, ScrollView, StyleSheet, TouchableOpacity, Image, Modal, Alert, FlatList, SafeAreaView} from "react-native";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { useAuth } from "../../contexts/auth";
import { supabase } from "../../lib/supabase";
import { useIsFocused } from "@react-navigation/native";
import { VictoryBar, VictoryPie, VictoryChart, VictoryGroup, VictoryAxis, VictoryLabel} from 'victory-native'


export default function Report() { 

  const SIZE = Dimensions.get('window');

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
  const [total, setTotal] = useState(0);

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

  // For selecting graph
  const [isPie, setIsPie] = useState(true);

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
      setTotal(0);
      setAverage(0);
    } else {
      setTotal(data.reduce((a, b) => a + b.amount, 0));
      newArr.push(new Date(data[0].inserted_at).toDateString());
      for (var i = 1; i < data.length; i++) {
        if (newArr[newArr.length - 1] !== new Date(data[i].inserted_at).toDateString()) {
          newArr.push(new Date(data[i].inserted_at).toDateString())
        }
      }
      setDate(newArr);
      if (averageSetting == "All") {
        setAverage(total);
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
    let {data} = await supabase.from('category').select('*').order("category", {ascending: true});
    setCategory(data);
  }

  function getCategoryTotal( category ) {
    return data.filter(x => x.category == category).reduce((a, b) => a + b.amount, 0);
  }

  function renderDetail( array ) {
    return array.map(x =>  
      <View 
        style={{
          borderRadius: 10,
          paddingHorizontal: 10,
          flexDirection: 'row',
          marginHorizontal: SIZE.width * 0.05,
          marginVertical: 5,
          backgroundColor: x.color, 
          borderWidth: 1,
        }} 
        key={x.id}
      >
        <View 
          style={style.categoryView}
        >
          <View style={{justifyContent: 'center'}}>
            <Text style={style.categoryList}> 
              {x.category} 
            </Text>
          </View>
        </View>
        <View 
          style={style.percentAmount}
        >
          <Text 
            style={style.categoryList}
          > 
            {(100 * (getCategoryTotal(x.category))/total).toFixed(2)}%
          </Text>
          <Text 
            style={style.amount}
          >
            SGD {(getCategoryTotal(x.category)).toFixed(2)}
          </Text>
        </View>
      </View>
    )
  }


  useEffect(() => {fetchData()}, []);
  useEffect(() => {if(isFocused) {fetchData()}}, [isFocused]);
  useEffect(() => {if(refresh) {fetchData()}}, [refresh]);


  return (
    <ScrollView 
      style={{
        flex: 1,
        flexDirecton: 'row',
        backgroundColor: '#f0ffff'
      }}
    >
        {/* <View style={{flexDirection: 'row', justifyContent: "space-around"}}> 
          <Text> Total for: </Text>
          <SelectList
            setSelected={(val) => {setAverageSetting(val); setRefresh(true)}}
            data={averagePick}
            save="value"
            defaultOption={{key:'5', value:'All'}}
          />
          <Text> SGD {(average).toFixed(2)}</Text>
        </View> */}

        {category && (total == 0 || category.length == 0)
          ? <Text style={{textAlign:'center', fontSize: 20, fontWeight: 800}}> You dont have any data yet! </Text>
          : isPie 
            ? 
              <View>
                <View style={style.chartTitle}>
                  <Text style={style.chart}> Pie Chart </Text>
                  <TouchableOpacity
                    onPress={() => setIsPie(!isPie)}
                  > 
                    <Text style={style.change}> Change to Bar Chart </Text> 
                  </TouchableOpacity>
                </View>
                <VictoryPie
                  startAngle={90}
                  endAngle={450}
                  data={
                    [...category.filter(x => 
                      getCategoryTotal(x.category) * 100/ total > 5
                    ).map(x => 
                      getCategoryTotal(x.category) * 100/ total
                    ),
                    ...category.map(x => 
                      (getCategoryTotal(x.category) * 100/ total)
                    ).filter(z => z <= 5)
                    .reduce((a, b)=> a + b , 0) != 0
                    ? [category.map(x => 
                      (getCategoryTotal(x.category) * 100/ total)
                    ).filter(z => z <= 5).reduce((a, b)=> a + b , 0)]
                    : []
                    ]
                  }
                  colorScale={
                    [...category.filter(x => 
                      getCategoryTotal(x.category) * 100/ total > 5
                    ).map(x => x.color),
                    ...category.map(x => 
                      (getCategoryTotal(x.category) * 100/ total)
                    ).filter(z => z <= 5)
                    .reduce((a, b)=> a + b , 0) != 0
                    ? ["#fbd203"]
                    : []
                    ]
                  }
                  labels={
                    [...(category.filter(x => 
                      getCategoryTotal(x.category) * 100/ total > 5
                    ).map(x => 
                      x.category
                      + "\n" 
                      + (getCategoryTotal(x.category) * 100/ total)
                        .toFixed(2)
                        .toString()
                      + "%"
                    )),
                    ...category.map(x => 
                      (getCategoryTotal(x.category) * 100/ total
                      )
                    ).filter(z => z <= 5)
                    .reduce((a, b)=> a + b , 0) != 0 
                    ? ["Other\n" 
                      + category.map(x => 
                        (getCategoryTotal(x.category) * 100/ total)
                      ).filter(z => z <= 5).reduce((a, b)=> a + b, 0).toFixed(2).toString()
                      + "%"]
                    : []
                    ]
                  }
                  labelPlacement={"parallel"}
                  radius={SIZE.width * 0.3 - 10}
                  innerRadius={SIZE.width * 0.3 - 50}
                  labelRadius={SIZE.width * 0.4 - 33}
                  padAngle={2}
                  padding={{left: 50, top: 0, right: 50, bottom: 0}}
                />
              </View>
            : 
              <View>
                  <View style={style.chartTitle}>
                    <Text style={style.chart}>  Bar Chart </Text>
                    <TouchableOpacity
                      onPress={() => setIsPie(!isPie)}
                    >
                      <Text style={style.change}> Change to Pie Chart </Text> 
                    </TouchableOpacity>
                </View>
                <VictoryChart domainPadding={11} padding={{left: 65, top: 20, right: 40, bottom: 50}}>
                  <VictoryBar 
                    barWidth={11}
                    style={{data: {fill: ({ datum }) => datum.category == "Other" ? "#fbd203" :category.filter(y => datum.category == y.category)[0].color}}}
                    x= "category"
                    y= "eachTotal"
                    data= {
                      [
                        ...category.reduce((a,b) => {
                          a.push(
                            {
                              category: b.category, 
                              eachTotal: 
                                getCategoryTotal(b.category)
                            }
                          )
                          return a;
                        },[]).filter(x => x.eachTotal > 5 * total/100),
                        {
                          category: "Other",
                          eachTotal: 
                            category.map(x => 
                              getCategoryTotal(x.category)
                            ).filter(z => z <= total/20).reduce((a, b)=> a + b, 0)
                        }
                      ] 
                    }
                  />
                  <VictoryAxis dependentAxis/>
                    <VictoryAxis
                      style={{tickLabels: {angle : 340, fontSize: ({ text }) => text.length > 10 ? 9: 11}}}
                    />
                </VictoryChart>    
              </View>
        }
      <View>
        <Text 
          style={style.subheader}
        > 
          Main 
          <Text style={{fontWeight: 700}}> (Categories over 5%)</Text>
        </Text>
        {category && 
          renderDetail(category.filter(x => 
            getCategoryTotal(x.category) * 100/ total > 5
          ))
        }
      </View>

      <View>
        <Text 
          style={style.subheader}
        > 
          Other
          <Text style={{fontWeight: 700}}> (Categories up to 5%)</Text>
        </Text>
        {category && 
          renderDetail(category.filter(x => 
            getCategoryTotal(x.category) * 100/ total <= 5
          ))
        }
      </View>
      {loading && <ActivityIndicator />}
    </ScrollView>
  );
} 

const style = StyleSheet.create({
  subheader: {
    fontSize: 20,
    fontWeight: 800,
    marginLeft: 17  
  },

  categoryList: {
    color: 'white',
    fontSize: 17,
    
    fontWeight: 800,
  },

  chart: {
    fontSize: 20, 
    fontWeight: 700,
  },
  chartTitle: {
    marginTop: 10,
    marginHorizontal: 30, 
    flexDirection: 'row', 
    justifyContent:'space-between'
    },

    change: {
      fontSize: 20, 
      fontWeight: 600,
      color: 'red'
    },

    amount: {
      fontSize: 15, 
      fontWeight: 600, 
      color: 'white',
    },

    percentAmount: {
      marginVertical : 3, 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'flex-end',
    },

    categoryView: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },

})

