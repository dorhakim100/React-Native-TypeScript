import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { Animated, Pressable, Text, StyleSheet, View } from 'react-native'
import { RootState } from '../../store/store'

import Colors from '../../../../constants/Colors'

export function HomeButton({ icon, text, color, action }) {
  const scale = useRef(new Animated.Value(1)).current

  const prefs = useSelector(
    (stateSelector: RootState) => stateSelector.systemModule.prefs
  )

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 1.05,
      useNativeDriver: true,
    }).start()
  }

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start()
  }

  return (
    <View style={styles.buttonContainer}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => console.log('Pressed')}
      >
        <Animated.View
          style={[
            { ...styles.button, backgroundColor: color },
            { transform: [{ scale }] },
          ]}
        >
          {icon}
        </Animated.View>
      </Pressable>
      <Text
        style={{
          ...styles.text,
          color: prefs.isDarkMode ? Colors.dark.text : Colors.light.text,
        }}
      >
        {text}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 5,
  },
  button: {
    backgroundColor: 'tomato',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,

    // Android shadow
    elevation: 6,
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
})
