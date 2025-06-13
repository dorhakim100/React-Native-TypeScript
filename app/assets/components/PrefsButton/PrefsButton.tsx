import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'

import { setIsPrefs } from '../../store/actions/system.actions'

import { RootState } from '../../store/store'

// Material-UI icons will be replaced with React Native icons or text placeholders
// import SettingsIcon from '@mui/icons-material/Settings'
// import TranslateIcon from '@mui/icons-material/Translate'

export function PrefsButton() {
  const isVisible = useSelector(
    (storeState: RootState) => storeState.systemModule.isPrefs
  )
  console.log(isVisible)

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        setIsPrefs(!isVisible)
      }}
    >
      <Text>TranslateIcon</Text>
      <Text>SettingsIcon</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
