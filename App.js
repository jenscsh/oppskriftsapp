import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Home from './views/Home';
import SetRecipe from './views/create/SetRecipe';
import SetStep from './views/create/SetStep';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={Home} options={{ title: "Mine oppskrifter" }} />
        <Stack.Screen name='New Recipe' component={SetRecipe} options={{ title: "Ny oppskrift" }} />
        <Stack.Screen name='Set Step' component={SetStep} options={{ title: "Nytt steg" }} />
      </Stack.Navigator>
    </NavigationContainer>
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
