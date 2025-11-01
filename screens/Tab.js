
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Historico from './Transactions'
import Configs from './Configs';
import { Entypo, Ionicons, AntDesign } from '@expo/vector-icons';


const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#00ccffff',
        tabBarInactiveTintColor: '#6e6868ff',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home1"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Histórico"
        component={Historico}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="history" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Configurações"
        component={Configs}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
