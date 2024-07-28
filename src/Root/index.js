import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../screen/Home';
import Login from '../screen/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Stack = createNativeStackNavigator();


const Root = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      setToken(!!userToken);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
    }}>
      {token ?
        <Stack.Screen name="Home">
          {props => <Home {...props} setToken={setToken} />}
        </Stack.Screen>
        :
        <Stack.Screen name="Login">
          {props => <Login {...props} setToken={setToken} />}
        </Stack.Screen>
      }
    </Stack.Navigator>
  )
}

export default Root