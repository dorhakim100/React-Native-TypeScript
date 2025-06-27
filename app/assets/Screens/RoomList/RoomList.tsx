import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'

import { roomService } from '../../services/room/room.service'

import { RoomCard } from '../../components/RoomCard/RoomCard'
import { RootState } from '../../store/store'
import { PasswordRoom } from '../../types/PasswordRoom/PasswordRoom'

import { RoomPasswordModal } from '../../components/RoomPasswordModal/RoomPasswordModal'
import { setIsLoading } from '../../store/actions/system.actions'
import { loadRooms } from '../../store/actions/room.actions'
import { showErrorMsg } from '../../services/event-bus.service'
import { RoomFilter } from '../../types/roomFilter/RoomFilter'
import { ScrollView } from 'react-native-gesture-handler'

export function RoomList() {
  const prefs = useSelector(
    (stateSelector: RootState) => stateSelector.systemModule.prefs
  )

  const rooms = useSelector(
    (stateSelector: RootState) => stateSelector.roomModule.rooms
  )

  const [filter, setFilter] = useState(roomService.getDefaultFilter())

  const [isPasswordModal, setIsPasswordModal] = useState(false)
  const [currPasswordModal, setCurrPasswordModal] =
    useState<PasswordRoom | null>(null)

  useEffect(() => {
    setRooms(filter)
    // loadRooms(filter)
  }, [filter])

  // useEffect(() => {
  //   fetch('https://camjam.onrender.com/api/room')
  //     .then((res) => res.text())
  //     .then(console.log)
  //     .catch(console.error)
  // }, [])

  async function setRooms(filterBy: RoomFilter) {
    try {
      setIsLoading(true)
      const rooms = await loadRooms(filterBy)
      console.log(rooms)
    } catch (err) {
      // console.error('Error setting rooms:', err)
      showErrorMsg('Failed to load rooms. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: prefs.isDarkMode ? '#333' : '#fff' },
      ]}
    >
      {rooms &&
        rooms.map((room) => (
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
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
})
