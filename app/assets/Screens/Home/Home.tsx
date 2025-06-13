import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { View, Text, StyleSheet } from 'react-native'

import { RootState } from '../../store/store'
import { ClockTime } from '../../components/ClockTime/ClockTime'

export function Home() {
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
    new Date().toLocaleDateString('en-US', {
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
    <View
      style={[
        styles.container,
        { backgroundColor: prefs.isDarkMode ? '#333' : '#fff' },
      ]}
    >
      <View style={styles.timesContainer}>
        {/* <View style={styles.timeDateContainer}>
          <Text style={styles.time}>{timeString}</Text>
          <Text style={styles.date}>{dateString}</Text>
        </View> */}
        <View
          style={[styles.clockContainer, prefs.isDarkMode && styles.darkClock]}
        >
          <ClockTime />

          {/* <Text style={{ color: prefs.isDarkMode ? '#fff' : '#000' }}>
            Clock Placeholder
          </Text> */}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timesContainer: {
    alignItems: 'center',
  },
  timeDateContainer: {
    alignItems: 'center',
  },
  time: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'black',
  },
  date: {
    fontSize: 20,
    color: 'gray',
  },
  clockContainer: {
    marginBottom: 200,
  },
  darkClock: {
    // Add dark mode specific styles for clock container if needed
  },
})
