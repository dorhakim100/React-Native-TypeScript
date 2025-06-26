import React from 'react'
import { View, Text } from 'react-native'
import { useSelector } from 'react-redux'

import { Room } from '../../types/room/Room'
import { RootState } from '../../store/store'

export function RoomCard({
  room,
  setIsPasswordModal,
  setCurrPasswordModal,
}: {
  room: Room
  setIsPasswordModal: (isOpen: boolean) => void
  setCurrPasswordModal: (
    currPasswordModal: { roomId: string; password: string } | null
  ) => void
}) {
  const prefs = useSelector(
    (stateSelector: RootState) => stateSelector.systemModule.prefs
  )

  const user = useSelector(
    (stateSelector: RootState) => stateSelector.userModule.user
  )

  return (
    <View>
      <Text>RoomCard</Text>
    </View>
  )
}
