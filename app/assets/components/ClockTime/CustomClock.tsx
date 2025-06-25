import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

const { width } = Dimensions.get('window')
const SIZE = width * 0.8 // clock diameter
const CENTER = SIZE / 2
const RADIUS = CENTER - 10 // leave a little padding

export function CustomClock() {
  const [time, setTime] = useState(new Date())

  const prefs = useSelector(
    (stateSelector: RootState) => stateSelector.systemModule.prefs
  )

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // calculate hand angles in degrees
  const seconds = time.getSeconds()
  const minutes = time.getMinutes() + seconds / 60
  const hours = (time.getHours() % 12) + minutes / 60

  const secondAngle = (seconds / 60) * 360
  const minuteAngle = (minutes / 60) * 360
  const hourAngle = (hours / 12) * 360

  // helper to get x/y from angle
  const polarToCartesian = (angle: number, length: number) => ({
    x: CENTER + length * Math.sin((angle * Math.PI) / 180),
    y: CENTER - length * Math.cos((angle * Math.PI) / 180),
  })

  // build hour-marks and numbers
  const ticks = Array.from({ length: 60 }).map((_, i) => {
    const angle = (i / 60) * 360
    const angleNums = (i / 12) * 360
    const outer = polarToCartesian(angle, RADIUS)
    const inner = polarToCartesian(angle, RADIUS - (i % 3 === 0 ? 20 : 10))
    const numPos = polarToCartesian(angleNums, RADIUS - 40)

    return (
      <React.Fragment key={i}>
        <Line
          x1={outer.x}
          y1={outer.y}
          x2={inner.x}
          y2={inner.y}
          stroke={prefs.isDarkMode ? '#fff' : '#333'}
          strokeWidth={i % 3 === 0 ? 4 : 2}
        />
        <SvgText
          x={numPos.x}
          y={numPos.y + 5} // +5 to center vertically
          fontSize={16}
          fontWeight='bold'
          fill={prefs.isDarkMode ? '#fff' : '#333'}
          textAnchor='middle'
        >
          {/* {i % 5 === 0 ? 12 : i} */}
        </SvgText>
      </React.Fragment>
    )
  })

  // draw a hand given angle, length, width, color
  const Hand = ({
    angle,
    length,
    strokeWidth,
    color,
  }: {
    angle: number
    length: number
    strokeWidth: number
    color: string
  }) => {
    const end = polarToCartesian(angle, length)
    return (
      <Line
        x1={CENTER}
        y1={CENTER}
        x2={end.x}
        y2={end.y}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap='round'
      />
    )
  }

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE}>
        {/* outer circle */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke={prefs.isDarkMode ? '#fff' : '#333'}
          strokeWidth={5}
          fill={prefs.isDarkMode ? '#222' : '#fafafa'}
        />

        {/* ticks + numbers */}
        {ticks}

        {/* hour hand */}
        <Hand
          angle={hourAngle}
          length={RADIUS * 0.5}
          strokeWidth={6}
          color={prefs.isDarkMode ? '#fff' : '#333'}
        />
        {/* minute hand */}
        <Hand
          angle={minuteAngle}
          length={RADIUS * 0.75}
          strokeWidth={4}
          color={prefs.isDarkMode ? '#fff' : '#555'}
        />
        {/* second hand */}
        <Hand
          angle={secondAngle}
          length={RADIUS * 0.85}
          strokeWidth={2}
          color='#e33'
        />

        {/* center pin */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={6}
          fill={prefs.isDarkMode ? '#fff' : '#333'}
        />
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
})
