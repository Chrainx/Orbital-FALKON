import { Tabs } from "expo-router";
import Expense from "./expense";

export default function AuthLayout() {
  return <Tabs
      style={{
        height: 10
      }}
      screenOptions={
        {
          headerTitle: "Moma",
          // headerBackground: add the logo
          headerStyle: {backgroundColor: "yellow"}
        }
      }
    >
    <Tabs.Screen
      name = "expense"
      options = {
        {
          tabBarLabel: "Expense", 
          //tabBarIcon:
        }
      }
    />
    <Tabs.Screen
      name = "report"
      options = {{tabBarLabel:"Report"}}
    />
    <Tabs.Screen
      name = "add"
      options = {{tabBarLabel: "Add"}}
    />
    <Tabs.Screen
      name = "setting"
      options = {{tabBarLabel: "Settings"}}
    />
  </Tabs>;
}