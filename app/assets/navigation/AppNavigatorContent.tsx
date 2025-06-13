import React from 'react'
import { View, StyleSheet } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import { AppHeader } from '../components/AppHeader/AppHeader'
import { SearchBar } from '../components/SearchBar/SearchBar'

import { Home } from '../Screens/Home/Home'
import { About } from '../Screens/About/About'
import { Services } from '../Screens/Services/Services'
import { Login } from '../Screens/Login/Login'
import { RoomList } from '../Screens/RoomList/RoomList'
import { SignIn } from '../Screens/SignIn/SignIn'

const Stack = createStackNavigator()

export function AppNavigatorContent() {
  return (
    <View style={styles.container}>
      {/* <AppHeader /> */}
      {/* <SearchBar /> */}
      <Stack.Navigator id={undefined} initialRouteName='Home'>
        <Stack.Screen
          name='Home'
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='About'
          component={About}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Services'
          component={Services}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Login'
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='RoomList'
          component={RoomList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='SignIn'
          component={SignIn}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
