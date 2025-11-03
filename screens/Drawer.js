
import { StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Perfil from './Perfil';
import Sobre from './Sobre';
import Tab from './Tab';
import ThemeProvider from '../contexts/themeContext';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <ThemeProvider>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={Tab} />
        <Drawer.Screen name="Perfil" component={Perfil} />
        <Drawer.Screen name="Sobre o App" component={Sobre} />
      </Drawer.Navigator>
    </ThemeProvider>
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
