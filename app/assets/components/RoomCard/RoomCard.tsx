import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../../navigation/types'
import { RootState } from '../../store/store'
import { Room } from '../../types/room/Room'
import { FontAwesome } from '@expo/vector-icons'

// Placeholder for removeRoom function
function removeRoom(room: Room, user: any) {
  // TODO: Implement removeRoom logic
  console.log('Remove room', room, user)
}

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
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

  const handleJoin = () => {
    if (!room.is_private && !room.password) {
      navigation.navigate('RoomList') // TODO: Change to actual room screen if available
    } else {
      setIsPasswordModal(true)
      setCurrPasswordModal({
        roomId: room.id,
        password: room.password || '',
      })
    }
  }

  return (
    <View style={[styles.cardContainer, prefs.isDarkMode && styles.darkMode]}>
      <View style={[styles.card, prefs.isDarkMode && styles.darkMode]}>
        {room.is_private && room.password && (
          <FontAwesome
            name='lock'
            size={20}
            color={prefs.isDarkMode ? '#fff' : '#333'}
            style={styles.privateIcon}
          />
        )}
        <Text style={[styles.roomName, prefs.isDarkMode && styles.darkText]}>
          {room.name}
        </Text>
        <Text style={styles.roomHost}>Host: {room.host.fullname}</Text>
        <Text style={styles.roomCreatedAt}>
          Created at: {new Date(room.created_at).toLocaleString()}
        </Text>
        <TouchableOpacity style={styles.primaryButton} onPress={handleJoin}>
          <Text style={styles.buttonText}>Join</Text>
        </TouchableOpacity>
        {user && user.id === room.host_id && (
          <TouchableOpacity
            style={[styles.primaryButton, styles.removeButton]}
            onPress={() => removeRoom(room, user)}
          >
            <Text style={styles.buttonText}>End</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkMode: {
    backgroundColor: '#222',
  },
  card: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'flex-start',
  },
  privateIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  roomName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  darkText: {
    color: '#fff',
  },
  roomHost: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
  },
  roomCreatedAt: {
    fontSize: 12,
    marginBottom: 12,
    color: '#888',
  },
  primaryButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 8,
  },
  removeButton: {
    backgroundColor: '#e33',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
})
