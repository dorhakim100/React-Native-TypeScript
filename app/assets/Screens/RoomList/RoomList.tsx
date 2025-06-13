import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'

import { RoomCard } from '../../components/RoomCard/RoomCard'
import { RootState } from '../../store/store'

export function RoomList() {
  const prefs = useSelector(
    (stateSelector: RootState) => stateSelector.systemModule.prefs
  )
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: prefs.isDarkMode ? '#333' : '#fff' },
      ]}
    >
      <Text
        style={[styles.title, { color: prefs.isDarkMode ? '#fff' : '#000' }]}
      >
        RoomList
      </Text>
      <RoomCard />
      <RoomCard />
      <RoomCard />
      <RoomCard />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
})
