import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'

import {
  setPrefs,
  setIsPrefs,
  onClosePrefsHeader,
} from '../../store/actions/system.actions'

import { DarkModeSwitch } from '../DarkModeSwitch/DarkModeSwitch'
import { LanguageSwitch } from '../LanguageSwitch/LanguageSwitch'
import { ShadowOverlay } from '../ShadowOverlay/ShadowOverlay'
import { RootState } from '../../store/store'
import Colors from '../../../../constants/Colors'

export function Prefs() {
  const prefs = useSelector(
    (storeState: RootState) => storeState.systemModule.prefs
  )
  const isPrefs = useSelector(
    (storeState: RootState) => storeState.systemModule.isPrefs
  )

  const isHeader = useSelector(
    (storeState: RootState) => storeState.systemModule.isHeader
  )

  const [darkMode, setDarkMode] = useState(prefs.isDarkMode)

  function onSetPrefs(type: string) {
    let newPrefs
    switch (type) {
      case 'lang':
        const newLang = !prefs.isEnglish
        newPrefs = { ...prefs, isEnglish: newLang }
        setPrefs(newPrefs)
        // closePrefsModal()
        return

      case 'darkMode':
        const newMode = !prefs.isDarkMode
        newPrefs = { ...prefs, isDarkMode: newMode }
        setDarkMode(newMode)
        setPrefs(newPrefs)
        // closePrefsModal()
        return

      default:
        break
    }
  }

  const closePrefsModal = () => setIsPrefs(false)
  return (
    <>
      <ShadowOverlay
        isVisble={isHeader || isPrefs}
        handleClose={onClosePrefsHeader}
      />
      <View
        style={[
          styles.prefsPanel,
          isPrefs
            ? {
                ...styles.prefsPanelVisible,
                backgroundColor: prefs.isDarkMode ? '#3e3e3e' : '#eee',
              }
            : null,
        ]}
      >
        <TouchableOpacity
          style={styles.closeContainer}
          onPress={closePrefsModal}
        >
          <AntDesign
            name='close'
            size={24}
            color={prefs.isDarkMode ? '#fff' : '#3e3e3e'}
          />
        </TouchableOpacity>
        <View style={styles.prefsControl}>
          {/* <LanguageSwitch
            onToggle={() => onSetPrefs('lang')}
            isEnglish={prefs.isEnglish}
          /> */}
          <DarkModeSwitch
          // The DarkModeSwitch component handles its own Redux logic, so no props are needed.
          />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  prefsPanel: {
    position: 'absolute',
    right: 5,
    top: 120,
    bottom: 0,
    width: 180,
    height: 150,

    // borderTopLeftRadius: 10,
    // borderBottomLeftRadius: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    transform: [{ translateX: 250 }],
    zIndex: 1000,
  },
  prefsPanelVisible: {
    transform: [{ translateX: 0 }],
  },
  closeContainer: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  prefsControl: {
    padding: 10,
  },
})
