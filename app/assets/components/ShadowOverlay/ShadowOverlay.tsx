import React from 'react'
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native'

interface ShadowOverlayProps {
  isVisble: boolean
  handleClose: () => void
}

export function ShadowOverlay({ isVisble, handleClose }: ShadowOverlayProps) {
  return isVisble ? (
    <TouchableWithoutFeedback onPress={handleClose}>
      <View style={styles.overlay}></View>
    </TouchableWithoutFeedback>
  ) : null
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10, // Adjust zIndex as needed to be above other content but below modals/drawers
  },
})
