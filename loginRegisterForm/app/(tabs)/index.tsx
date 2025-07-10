import React from 'react';
import RegisterScreen from '@/screens/RegisterScreen';
import LoginScreen from '@/screens/LoginScreen';
import DashboardScreen from '@/screens/DashboardScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
 
const Stack = createNativeStackNavigator();

export default function HomeScreen() {
    return(
      
        <Stack.Navigator initialRouteName='login'>
          <Stack.Screen name='register' component={RegisterScreen} />
          <Stack.Screen name='login' component={LoginScreen} />
          <Stack.Screen name='dashboard' component={DashboardScreen} />
        </Stack.Navigator>
      
    )
}
