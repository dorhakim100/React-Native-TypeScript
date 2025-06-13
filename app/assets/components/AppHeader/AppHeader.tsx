import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native'
import { useNavigation, NavigationProp } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons' // For menu icon
import { StackNavigationProp } from '@react-navigation/stack' // Import StackNavigationProp

import { RootState } from '../../store/store'
import {
  onClosePrefsHeader,
  setIsHeader,
  setIsPrefs,
} from '../../store/actions/system.actions'
import { routes, Route } from '../../routes/routes'
import { RootStackParamList } from '../../navigation/types'
// import { DropdownMenu } from '../DropdownMenu/DropdownMenu' // Will port this component later

interface AppHeaderProps {
  // No longer needs routes prop as they are imported directly
}

export function AppHeader({}: AppHeaderProps) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const prefs = useSelector(
    (stateSelector: RootState) => stateSelector.systemModule.prefs
  )

  const isHeader = useSelector(
    (stateSelector: RootState) => stateSelector.systemModule.isHeader
  )

  const isPrefs = useSelector(
    (stateSelector: RootState) => stateSelector.systemModule.isPrefs
  )

  const navigateToPage = (path: keyof RootStackParamList) => {
    // navigation.replace(path)
    navigation.navigate(path)
    setIsHeader(false) // Close header after navigation
  }

  return (
    <>
      {(isHeader || isPrefs) && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={onClosePrefsHeader}
        ></TouchableOpacity>
      )}
      <SafeAreaView
        style={[
          styles.header,
          isHeader && styles.headerVisible,
          prefs.isDarkMode && styles.darkMode,
        ]}
      >
        <View style={styles.menuItemsContainer}>
          {routes.map((route: Route, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigateToPage(route.path)}
              style={styles.menuItem}
            >
              <Text
                style={[
                  styles.menuItemText,
                  { color: prefs.isDarkMode ? '#fff' : '#000' },
                ]}
              >
                {route.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 0, // No longer need extra padding for status bar if SafeAreaView is used overall
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100, // Still ensure header is on top for overlays if any
  },
  headerVisible: {
    // No specific style needed here unless you want animations for visibility
  },
  darkMode: {
    backgroundColor: '#333',
    borderBottomColor: '#555',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 99,
  },
  menuItemsContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuItem: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
})
