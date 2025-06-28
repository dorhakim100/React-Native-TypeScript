import { View, Text } from 'react-native'
import { StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RoomState } from '../../store/reducers/room.reducer'
import { RootState } from '../../store/store'
import { setIsLoading } from '../../store/actions/system.actions'
import { loadRoom } from '../../store/actions/room.actions'

import { WebView } from 'react-native-webview'

export function Room({ navigation, route }) {
  const room = useSelector(
    (stateSelector: RootState) => stateSelector.roomModule.room
  )

  useEffect(() => {
    const id = route.params.roomId
    setRoom(id)
  }, [])

  async function setRoom(roomId: string) {
    try {
      setIsLoading(true)
      const room = await loadRoom(roomId)
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (room)
    return (
      <View style={styles.container}>
        {/* <Text>Room</Text>
        <Text>{room.name}</Text>
        <Text>{room.host_id}</Text>
        <Text>{room.id}</Text> */}
        {/* <View style={styles.webviewContainer}>
          <WebView
            source={{ uri: `https://camjam.onrender.com/room/${room.id}` }}
            style={{ flex: 1 }}
          />
        </View> */}
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // important!
    // paddingTop: 40,
  },
  webviewContainer: {
    flex: 1, // this will allow the WebView to expand
    // marginTop: 20,
    // height: 300,
    marginTop: -70,
  },
})
