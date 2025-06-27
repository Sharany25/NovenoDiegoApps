import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import FormularioScreen from '../screens/FormularioScreen';
import { Servicio } from '../interfaces/types';

export type RootStackParamList = {
  Home: undefined;
  Formulario: { servicio?: Servicio };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Formulario" component={FormularioScreen} />
    </Stack.Navigator>
  );
}
