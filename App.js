import { View, Text } from 'react-native'
import React from 'react'
import Root from './src/Root'
import { NavigationContainer } from '@react-navigation/native'
const App = () => {
  return (
      <NavigationContainer>
        <Root/>
      </NavigationContainer>
  )
}

export default App