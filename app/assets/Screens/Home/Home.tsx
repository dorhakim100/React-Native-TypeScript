import { useSelector } from 'react-redux'
import { View, StyleSheet } from 'react-native'

import { RootState } from '../../store/store'
import { HomeButton } from '../../components/HomeButton/HomeButton'
import { ClockTime } from '../../components/ClockTime/ClockTime'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Entypo from '@expo/vector-icons/Entypo'

export function Home() {
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
      <View style={styles.timesContainer}>
        <View
          style={[styles.clockContainer, prefs.isDarkMode && styles.darkClock]}
        >
          <ClockTime />
        </View>
      </View>
      <View style={styles.buttonsContainer}>
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
  clockContainer: {
    marginBottom: 100,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkClock: {
    // Add dark mode specific styles for clock container if needed
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
})
