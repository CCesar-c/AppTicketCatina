import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ThemeProvider, { ThemeContext } from './contexts/themeContext';
import { MoneyProvider } from './contexts/ContextMoney';
import DrawerNavigator from './screens/Drawer';
import Login from './screens/Login';
import RouterAdmin from './screens/AdminOptions';
import DetalhesCompras from './screens/DetalhesCompras';
import RouterCardapio from './screens/Cardapio';
import Carrinho from './screens/Carrinho';

import { useContext } from 'react';
import RouterCreditos from './screens/Creditos';

function RootNavigator() {
  const { theme } = useContext(ThemeContext);
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
        }}
      >
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Drawer" component={DrawerNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="DetalhesCompras" component={DetalhesCompras} />
        <Stack.Screen name="RouterAdmin" component={RouterAdmin} options={{ headerShown: false }} />
        <Stack.Screen name="Cardapio" component={RouterCardapio} options={{ headerShown: false }} />
        <Stack.Screen name="Creditos" component={RouterCreditos} options={{ headerShown: false }} />
        

      </Stack.Navigator >
    </NavigationContainer >
  );
}

export default function App() {
  return (

    <ThemeProvider>
      <MoneyProvider>
        <RootNavigator />
      </MoneyProvider>
    </ThemeProvider>
  );
}
