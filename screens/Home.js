import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', margin: 10 }}>Saldo de tickets: </Text>
      <StatusBar style="auto" />
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
