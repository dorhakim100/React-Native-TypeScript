import React from 'react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { View, Text, StyleSheet } from 'react-native'
// import Clock from 'react-live-clock'

import { RootState } from '../../store/store'
import { CustomClock } from './CustomClock'
import Colors from '../../../../constants/Colors'

export function ClockTime() {
  const prefs = useSelector(
    (stateSelector: RootState) => stateSelector.systemModule.prefs
  )

  const [dateValue, setDateValue] = useState(new Date())
  const [timeString, setTimeString] = useState(
    new Date().toLocaleTimeString('he', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  )
  const [dateString, setDateString] = useState(
    new Date().toLocaleDateString('eng', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  )

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date()
      const string = date.toLocaleTimeString('he', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      setTimeString(string)
      setDateValue(date)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])
  return (
    <View style={styles.container}>
      <Text
        style={{
          ...styles.time,
          color: prefs.isDarkMode ? Colors.dark.text : Colors.light.text,
        }}
      >
        {timeString}
      </Text>

      <Text
        style={{ ...styles.date, color: prefs.isDarkMode ? '#fff' : '#333' }}
      >
        {new Date().toLocaleDateString('eng', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })}
      </Text>
      <CustomClock />
      {/* date below, you can localize as you like */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  time: { fontSize: 48, fontWeight: 'bold' },
  date: { fontSize: 18, marginTop: 4 },
})
