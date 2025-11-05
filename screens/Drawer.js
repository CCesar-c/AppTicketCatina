
import { StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Perfil from './Perfil';
import Sobre from './Sobre';
import Tab from './Tab';
import { ThemeContext } from '../contexts/themeContext';
import { useContext } from 'react';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {

  const { theme } = useContext(ThemeContext);

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        drawerStyle: { backgroundColor: theme.background },
        drawerActiveTintColor: theme.text,
        drawerInactiveTintColor: theme.text,
      }}>
      <Drawer.Screen name="Home" component={Tab} />
      <Drawer.Screen name="Perfil" component={Perfil} />
      <Drawer.Screen name="Sobre o App" component={Sobre} />
    </Drawer.Navigator>
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
