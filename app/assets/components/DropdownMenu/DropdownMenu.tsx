import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native'
import { useSelector } from 'react-redux'

import { setIsHeader } from '../../store/actions/system.actions'
import { RootState } from '../../store/store'
import { DropdownOption } from '../../types/DropdownOption'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

export function DropdownMenu({ options }: { options: DropdownOption[] }) {
  const prefs = useSelector(
    (stateSelector: RootState) => stateSelector.systemModule.prefs
  )
  const isHeader = useSelector(
    (stateSelector: RootState) => stateSelector.systemModule.isHeader
  )

  const [modalVisible, setModalVisible] = useState(false)

  const handleOpen = () => {
    setModalVisible(true)
    setIsHeader(true) // Assuming isHeader should be true when menu is open
  }

  const handleClose = () => {
    setModalVisible(false)
    setIsHeader(false)
  }

  return (
    <View>
      <TouchableOpacity style={styles.iconButton} onPress={handleOpen}>
        <Text style={{ color: prefs.isDarkMode ? '#fff' : '#000' }}>
          {modalVisible ? (
            <MaterialIcons
              name='menu-open'
              size={35}
              color={prefs.isDarkMode ? '#fff' : '#333'}
            />
          ) : (
            <MaterialIcons
              name='menu'
              size={35}
              color={prefs.isDarkMode ? '#fff' : '#333'}
            />
          )}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleClose}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleClose} // Close modal when touching outside
        >
          <View
            style={[
              styles.menuContainer,
              { backgroundColor: prefs.isDarkMode ? '#222' : '#fff' },
            ]}
          >
            {options.map((option: DropdownOption, index: number) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => {
                    option.onClick()
                    handleClose()
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: prefs.isDarkMode ? '#fff' : '#000',
                    }}
                  >
                    {option.title}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  iconButton: {
    // padding: 10,
    paddingHorizontal: 5,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
  },
  menuContainer: {
    marginTop: 120, // Adjust position based on AppHeader/SearchBar
    marginRight: 10, // Adjust position
    borderRadius: 5,
    minWidth: 200,
    elevation: 5, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
})
