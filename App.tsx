import * as React from 'react'
import { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Provider } from 'react-redux'
import { store } from './app/assets/store/store'
import { PaperProvider } from 'react-native-paper'
// import authStorage from './app/assets/api/user/storage'

import * as Notifications from 'expo-notifications'

import { AppNavigatorContent } from './app/assets/navigation/AppNavigatorContent'

// import { Home } from './app/assets/Screens/Home/Home'
// import { About } from './app/assets/Screens/About/About'
// import { Services } from './app/assets/Screens/Services/Services'
// import { Login } from './app/assets/Screens/Login/Login'
// import { RoomList } from './app/assets/Screens/RoomList/RoomList'
// import { SignIn } from './app/assets/Screens/SignIn/SignIn'

// import { AppHeader } from './app/assets/components/AppHeader/AppHeader'
// import { SearchBar } from './app/assets/components/SearchBar/SearchBar'

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SearchBar } from './app/assets/components/SearchBar/SearchBar'
import { Prefs } from './app/assets/components/Prefs/Prefs'

// import CustomBottomNavigation from './app/assets/navigation/BottomNavigation'
// import NavigationTheme from './app/assets/navigation/NavigationTheme'
// import { setRemembered } from './app/assets/store/actions/user.actions'

const Stack = createStackNavigator()

export default function App() {
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification: Notifications.Notification) => {
        console.log(notification)
      }
    )
    return () => subscription.remove()
  }, [])

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider>
          <SafeAreaView style={styles.safeArea}>
            <NavigationContainer>
              <SearchBar/>
              <Prefs/>
              <AppNavigatorContent />
            </NavigationContainer>
          </SafeAreaView>
        </PaperProvider>
      </GestureHandlerRootView>
    </Provider>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
})
