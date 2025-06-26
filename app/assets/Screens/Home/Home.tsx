import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

import { RootState } from '../../store/store'

import { HomeButton } from '../../components/HomeButton/HomeButton'
import { ClockTime } from '../../components/ClockTime/ClockTime'
import { Button } from 'react-native-paper'

import FontAwesome from '@expo/vector-icons/FontAwesome'
import Entypo from '@expo/vector-icons/Entypo'

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
          {/* <ClockTime /> */}

          {/* <Text style={{ color: prefs.isDarkMode ? '#fff' : '#000' }}>
            Clock Placeholder
          </Text> */}
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        {/* <TouchableOpacity style={styles.buttonContainer}></TouchableOpacity> */}
        <HomeButton
          icon={<FontAwesome name='video-camera' size={36} color='#fff' />}
          text={'New Meeting'}
          color={'#F26D21'}
        />
        <HomeButton
          icon={<Entypo name='squared-plus' size={36} color='#fff' />}
          text={'Join'}
          color={'#2D8CFF'}
        />
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
    marginBottom: 100,
    height: 300,
  },
  darkClock: {
    // Add dark mode specific styles for clock container if needed
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  buttonContainer: {
    backgroundColor: 'red',
    height: 70,
    width: 70,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
