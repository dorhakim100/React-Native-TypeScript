import * as React from 'react'
import { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native'
import {
  useNavigation,
  NavigationProp,
  StackActions,
} from '@react-navigation/native'

import { Ionicons } from '@expo/vector-icons'

import { useSelector } from 'react-redux'

import { setIsHeader, setIsPrefs } from '../../store/actions/system.actions'

import { RootState } from '../../store/store'
import { routes, Route } from '../../routes/routes'
import { DropdownMenu } from '../DropdownMenu/DropdownMenu'

import { DropdownOption } from '../../types/DropdownOption'
import { RootStackParamList } from '../../navigation/types'
import { StackNavigationProp } from '@react-navigation/stack'
import Colors from '../../../../constants/Colors'

export function SearchBar() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const prefs = useSelector(
    (stateSelector: RootState) => stateSelector.systemModule.prefs
  )
  const isPrefs = useSelector(
    (stateSelector: RootState) => stateSelector.systemModule.isPrefs
  )

  const isHeader = useSelector(
    (stateSelector: RootState) => stateSelector.systemModule.isHeader
  )

  const logo = require('../../../../assets/images/logo.png')
  const logoDarkMode = require('../../../../assets/images/logo-dark.png')

  const [currLogo, setCurrLogo] = useState(logo)

  const [dropdownOptions, setDropdownOptions] = useState<DropdownOption[]>([])

  const onToggleMenu = () => {
    setIsHeader(!isHeader)
  }

  useEffect(() => {
    setCurrLogo(prefs.isDarkMode ? logoDarkMode : logo)
  }, [prefs.isDarkMode])

  useEffect(() => {
    const options = routes
      .map((route: Route) => {
        // if (route.isList)
        console.log(route)

        if (route.isList)
          return {
            title: route.title,
            onClick: (): void => {
              // navigation.replace(route.path as keyof RootStackParamList)
              navigation.dispatch(
                StackActions.replace(route.path as keyof RootStackParamList)
              )
              // navigation.navigate(route.path as keyof RootStackParamList)
            },
          }
      })
      .filter((option) => option)
    setDropdownOptions(options)
  }, [])

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: prefs.isDarkMode ? '#333' : '#fff' },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image source={currLogo} style={styles.image}></Image>
      </View>
      <View
        style={[styles.searchContainer, prefs.isDarkMode && styles.darkMode]}
      >
        <TextInput
          style={[
            styles.inputBase,
            {
              color: prefs.isDarkMode ? Colors.dark.text : Colors.light.text,
              backgroundColor: prefs.isDarkMode ? '#555' : '#f0f0f0',
            },
          ]}
          placeholder='Search meeting'
          placeholderTextColor={prefs.isDarkMode ? '#ccc' : '#666'}
        />
        <TouchableOpacity
          style={{
            ...styles.iconButton,
            backgroundColor: prefs.isDarkMode ? '#555' : '#f0f0f0',
          }}
        >
          <Ionicons
            name='search'
            size={20}
            color={prefs.isDarkMode ? '#fff' : '#000'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.settingsContainer}>
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            setIsPrefs(!isPrefs)
          }}
        >
          <Ionicons
            name='settings'
            size={30}
            // color={prefs.isDarkMode ? '#fff' : '#000'}
            color={Colors.light.tint}
          />
        </TouchableOpacity>
        <View style={styles.menuContainer}>
          <DropdownMenu options={dropdownOptions} />
        </View>
      </View>
    </View>
  )
}

const searchBarHeight = 60

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },

  imageContainer: {
    // display: 'flex',
    width: 100,
    height: 50,
  },

  image: {
    width: 100,
    height: 50,
  },

  menuContainer: {
    // flex: 1, // Adjust as needed
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#f0f0f0', // Placeholder, adjust as needed
    borderRadius: 50,
    // marginHorizontal: 5,
    marginVertical: 5,
    height: searchBarHeight,
    borderColor: '#9e9e9e',
    borderWidth: 0.7,
  },
  darkMode: {
    backgroundColor: '#555', // Placeholder, adjust as needed
  },
  inputBase: {
    flex: 1,
    padding: 10,

    borderRadius: 50,
  },
  iconButton: {
    // padding: 10,
    // backgroundColor: 'transparent', // Make sure the button is transparent

    paddingInlineEnd: 7.5,
    paddingInlineStart: 7.5,
    // paddingVertical: 10.5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  settingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 28,
    width: 1,
    backgroundColor: '#ccc',
    marginInlineEnd: 2,
    marginInlineStart: 8,
  },
})
