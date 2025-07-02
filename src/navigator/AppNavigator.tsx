import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AutosHomeScreen } from '../screens/AutosHomeScreen';
import { AutoFormScreen } from '../screens/AutoFormScreen';
import { Auto } from '../interfaces/auto';

export type RootStackParamList = {
  AutosHome: undefined;
  AutoForm: { auto?: Auto };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="AutosHome">
      <Stack.Screen
        name="AutosHome"
        component={AutosHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AutoForm"
        component={AutoFormScreen}
        options={{ title: 'Registrar / Editar Auto' }}
      />
    </Stack.Navigator>
  );
}
