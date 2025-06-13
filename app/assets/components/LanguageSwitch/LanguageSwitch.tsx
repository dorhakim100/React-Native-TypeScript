import React from 'react'
import { View, Text, StyleSheet, Switch } from 'react-native'

interface LanguageSwitchProps {
  isEnglish: boolean
  onToggle: (newValue: boolean) => void
}

export function LanguageSwitch({ isEnglish, onToggle }: LanguageSwitchProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.label, !isEnglish && styles.activeLabel]}>ENG</Text>
      <Switch
        trackColor={{ false: '#aab4be', true: '#aab4be' }}
        thumbColor={'#001e3c'}
        ios_backgroundColor='#aab4be'
        onValueChange={onToggle}
        value={!isEnglish}
        style={styles.switch}
      />
      <Text style={[styles.label, isEnglish && styles.activeLabel]}>עברית</Text>
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
    // You might want to change color or add more emphasis here
  },
  switch: {
    // Additional styling for the switch itself if needed
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], // Make it slightly larger
  },
})
