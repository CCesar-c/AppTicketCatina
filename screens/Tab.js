
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Historico from './Transactions'
import Configs from './Configs';
import { Entypo, Ionicons, AntDesign } from '@expo/vector-icons';
import { ThemeContext } from '../contexts/themeContext';
import { useContext } from 'react';


const Tab = createBottomTabNavigator();

export default function TabNavigator() {

  const { theme } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.background }
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={size} color={theme.text} />
          ),
        }}
      />
      <Tab.Screen
        name="Histórico"
        component={Historico}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="history" size={size} color={theme.text} />
          ),
        }}
      />
      <Tab.Screen
        name="Configurações"
        component={Configs}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={theme.text} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}