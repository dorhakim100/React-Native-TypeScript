import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'

import { RoomCard } from '../../components/RoomCard/RoomCard'
import { RootState } from '../../store/store'
import { PasswordRoom } from '../../types/PasswordRoom/PasswordRoom'

import { RoomPasswordModal } from '../../components/RoomPasswordModal/RoomPasswordModal'

export function RoomList() {
  const prefs = useSelector(
    (stateSelector: RootState) => stateSelector.systemModule.prefs
  )

  const rooms = useSelector(
    (stateSelector: RootState) => stateSelector.roomModule.rooms
  )

  const [isPasswordModal, setIsPasswordModal] = useState(false)
  const [currPasswordModal, setCurrPasswordModal] =
    useState<PasswordRoom | null>(null)
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
      {rooms.map((room) => (
        <>
          <RoomCard
            key={room.id}
            room={room}
            setIsPasswordModal={setIsPasswordModal}
            setCurrPasswordModal={setCurrPasswordModal}
          />
        </>
      ))}
      {isPasswordModal && currPasswordModal && (
        <RoomPasswordModal
          key={`password-modal`}
          roomData={currPasswordModal}
          setIsPasswordModal={setIsPasswordModal}
        />
      )}
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
