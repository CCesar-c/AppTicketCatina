import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NewButton } from '../components/componets'


// const Tab = createBottomTabNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator >
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', margin: 10 }}>Saldo de tickets: </Text>
      <NewButton onPress={() => { alert("querro goza") }} activeOpacity={0.6}>
        Carregar creditos
      </NewButton>
      <NewButton onPress={() => { alert("querro goza") }} activeOpacity={0.6} >
        Comprar na cantina
      </NewButton>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {

    textAlign: 'left',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
  },
});
