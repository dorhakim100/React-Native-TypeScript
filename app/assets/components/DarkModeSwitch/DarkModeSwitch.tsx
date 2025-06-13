import React from 'react'
import { View, Text, StyleSheet, Switch } from 'react-native'
import { useSelector } from 'react-redux'

import { RootState } from '../../store/store'
import { setPrefs } from '../../store/actions/system.actions'

export function DarkModeSwitch() {
  const prefs = useSelector(
    (stateSelector: RootState) => stateSelector.systemModule.prefs
  )

  const handleToggleDarkMode = () => {
    setPrefs({ ...prefs, isDarkMode: !prefs.isDarkMode })
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.label, !prefs.isDarkMode && styles.activeLabel]}>
        Light
      </Text>
      <Switch
        trackColor={{ false: '#aab4be', true: '#aab4be' }}
        thumbColor={'#001e3c'}
        ios_backgroundColor='#aab4be'
        onValueChange={handleToggleDarkMode}
        value={prefs.isDarkMode}
        style={styles.switch}
      />
      <Text style={[styles.label, prefs.isDarkMode && styles.activeLabel]}>
        Dark
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
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
