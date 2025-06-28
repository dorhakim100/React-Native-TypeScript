import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../../navigation/types'

import { showErrorMsg } from '../../services/event-bus.service'

import { RootState } from '../../store/store'

export function RoomPasswordModal({
  roomData,
  setIsPasswordModal,
}: {
  roomData: { roomId: string; password: string }
  setIsPasswordModal: (isOpen: boolean) => void
}) {
  const prefs = useSelector(
    (stateSelector: RootState) => stateSelector.systemModule.prefs
  )
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

  const [password, setPassword] = useState<string>('')

  const handlePasswordChange = (text: string) => {
    setPassword(text)
  }
  const checkPassword = () => {
    if (roomData.password && roomData.password !== password) {
      showErrorMsg('Incorrect password')
      return
    }
    setIsPasswordModal(false)
    navigation.navigate('Room', { roomId: roomData.roomId })
  }

  const closeModal = () => {
    setIsPasswordModal(false)
  }

  useEffect(() => {
    console.log('RoomPasswordModal mounted', roomData)
  }, [roomData])

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType='fade'
      onRequestClose={closeModal}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            prefs.isDarkMode ? styles.darkMode : null,
          ]}
        >
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>⏎</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Room Password Required</Text>
          <Text style={styles.subtitle}>
            Please enter the password to join this room.
          </Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={handlePasswordChange}
            placeholder='Password'
            secureTextEntry
            autoFocus
          />
          <TouchableOpacity
            style={[styles.primaryButton, !password && styles.disabledButton]}
            disabled={!password}
            onPress={checkPassword}
          >
            <Text style={styles.buttonText}>Enter Password</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    position: 'absolute',
    top: 200,

    width: '80%',

    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 25,
    paddingVertical: 40,
    alignItems: 'center',
    elevation: 5,
  },
  darkMode: {
    backgroundColor: '#222',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 5,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#888',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    color: '#555',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
    color: '#222',
  },
  primaryButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 5,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
})
