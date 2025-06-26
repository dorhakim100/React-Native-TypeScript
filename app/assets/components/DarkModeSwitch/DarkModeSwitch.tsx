import React from 'react'
import { View, Text, StyleSheet, Switch } from 'react-native'
import { useSelector } from 'react-redux'

import { RootState } from '../../store/store'
import { setPrefs } from '../../store/actions/system.actions'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Entypo from '@expo/vector-icons/Entypo'
import Colors from '../../../../constants/Colors'

export function DarkModeSwitch() {
  const prefs = useSelector(
    (stateSelector: RootState) => stateSelector.systemModule.prefs
  )

  const handleToggleDarkMode = () => {
    setPrefs({ ...prefs, isDarkMode: !prefs.isDarkMode })
  }

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: prefs.isDarkMode ? '#3e3e3e' : '',
      }}
    >
      {/* <Text style={[styles.label, !prefs.isDarkMode && styles.activeLabel]}>
        Light
      </Text> */}
      <Entypo
        name='light-up'
        size={30}
        color={prefs.isDarkMode ? Colors.dark.text : Colors.light.text}
      />
      <Switch
        trackColor={{ false: '#aab4be', true: '#aab4be' }}
        thumbColor={'#001e3c'}
        ios_backgroundColor='#aab4be'
        onValueChange={handleToggleDarkMode}
        value={prefs.isDarkMode}
        style={styles.switch}
      />
      {/* <Text style={[styles.label, prefs.isDarkMode && styles.activeLabel]}>
        Dark
      </Text> */}
      <MaterialIcons
        name='dark-mode'
        size={30}
        color={prefs.isDarkMode ? Colors.dark.text : Colors.light.text}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    gap: 10,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginHorizontal: 5,
  },
  activeLabel: {
    fontWeight: 'bold',
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
})
