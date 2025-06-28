import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { StyleSheet } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { PermissionsAndroid, Platform } from 'react-native'

import { useSelector } from 'react-redux'
import { RoomState } from '../../store/reducers/room.reducer'
import { RootState } from '../../store/store'
import { setIsLoading } from '../../store/actions/system.actions'
import { loadRoom } from '../../store/actions/room.actions'
import { handleGuestMode } from '../../store/actions/user.actios'

import {
  mediaDevices,
  RTCView,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
} from 'react-native-webrtc'

import {
  socketService,
  SocketUser,
  SOCKET_EVENT_MEMBER_CHANGE,
  socket,
  SOCKET_EVENT_OFFER,
  SOCKET_EVENT_ANSWER,
  SOCKET_EVENT_ICE_CANDIDATE,
  SOCKET_EVENT_END_MEETING,
} from '../../services/socket.service'

import { WebRTCService } from '../../services/webRTC/webRTC2'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'

export function Room({ navigation, route }) {
  const { roomId } = route.params
  // const navigate = useNavigate()

  const room = useSelector(
    (stateSelector: RootState) => stateSelector.roomModule.room
  )

  const user = useSelector(
    (stateSelector: RootState) => stateSelector.userModule.user
  )

  const prefs = useSelector(
    (stateSelector: RootState) => stateSelector.systemModule.prefs
  )

  // const isFirstRender = useSelector(
  //   (stateSelector: RootState) => stateSelector.systemModule.isFirstRender
  // )

  const [webRTCService, setWebRTCService] = useState<WebRTCService | null>(null)
  const [localStream, setLocalStream] = useState(null)
  const [remoteStreams, setRemoteStreams] = useState<Map<string, any>>(
    new Map()
  )

  const connectedPeers = useRef<Set<string>>(new Set())
  const [localTracks, setLocalTracks] = useState({
    video: null,
    audio: null,
  })

  const [currMembers, setCurrentMembers] = useState<SocketUser[]>([])
  const [errorBanner, setErrorBanner] = useState<string | null>(null)

  useEffect(() => {
    setRoom()
  }, [roomId])

  useEffect(() => {
    const newWebRTCService = new WebRTCService(socket)
    setWebRTCService(newWebRTCService)
  }, [user])

  useEffect(() => {
    // if (!socketService || !webRTCService || !roomId || !user) return

    initializeMedia()
    // addListeners()

    return () => {
      clearAllConnections()
    }
  }, [socket, webRTCService, user, roomId])

  useEffect(() => {
    if (!webRTCService || !currMembers.length) return
    currMembers.forEach((member: SocketUser) => {
      if (!member.socketId) return
      webRTCService.createPeerConnection(member.socketId, (stream) => {
        if (!member.socketId) return
        setRemoteStreams((prev) => new Map(prev.set(member.socketId, stream)))
      })
      connectedPeers.current.add(member.socketId)
      // setIsFirstRender(false)
    })
  }, [currMembers])

  async function setRoom() {
    if (!roomId) return
    try {
      setIsLoading(true)
      if (!user) {
        handleGuestMode()
      }
      await loadRoom(roomId)
    } catch (error) {
      showErrorMsg('Failed to set room details')
    } finally {
      setIsLoading(false)
    }
  }

  async function addListeners() {
    if (!socketService || !webRTCService || !roomId || !user) return

    socket.on(SOCKET_EVENT_MEMBER_CHANGE, (members) => {
      members = members.filter((member: SocketUser) => member)
      setCurrentMembers(members)

      members.forEach(async (member: any) => {
        if (member.socketId !== socket.id) {
          if (connectedPeers.current.has(member.socketId)) {
            connectedPeers.current.delete(member.socketId)
          }
          try {
            setIsLoading(true)
            await webRTCService.createPeerConnection(
              member.socketId,
              (stream) => {
                setRemoteStreams(
                  (prev) => new Map(prev.set(member.socketId, stream))
                )
              }
            )
            connectedPeers.current.add(member.socketId)
            setErrorBanner('')
          } catch (error) {
            console.log(error)
          } finally {
            setIsLoading(false)
          }
        }
      })
    })

    socket.on(SOCKET_EVENT_OFFER, async ({ offer, from }) => {
      try {
        setIsLoading(true)
        await webRTCService.handleOffer(offer, from, (stream) => {
          setRemoteStreams((prev) => new Map(prev.set(from, stream)))
        })
        connectedPeers.current.add(from)
        setErrorBanner('')
      } catch (error) {
        console.log(error)
        setErrorBanner('Failed to connect to peer')
      } finally {
        setIsLoading(false)
      }
    })

    socket.on(SOCKET_EVENT_ANSWER, async ({ answer, from }) => {
      try {
        setIsLoading(true)
        await webRTCService.handleAnswer(answer, from)
      } catch (error) {
        console.log(error)
        setErrorBanner('Failed to connect to peer')
      } finally {
        setIsLoading(false)
      }
    })

    socket.on(SOCKET_EVENT_ICE_CANDIDATE, async ({ candidate, from }) => {
      try {
        setIsLoading(true)
        await webRTCService.handleIceCandidate(candidate, from)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    })

    socket.on(SOCKET_EVENT_END_MEETING, async () => {
      try {
        setIsLoading(true)
        clearAllConnections()
        navigation.navigate('RoomList')
        showSuccessMsg('Meeting ended')
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    })
  }

  async function initializeMedia(
    isRestart: boolean = false,
    isMuted: boolean = false
  ) {
    try {
      if (!socketService || !webRTCService || !roomId || !user) return
      setIsLoading(true)

      if (isRestart) {
        clearAllConnections()
      }

      const hasPermission = await requestPermissions()
      if (!hasPermission) {
        setErrorBanner('Camera permission not granted')
        return
      }

      const stream = await webRTCService.getLocalStream()
      console.log(stream)

      setLocalStream(stream)

      const videoTrack = stream.getVideoTracks()[0] || null
      const audioTrack = stream.getAudioTracks()[0] || null

      setLocalTracks({
        video: videoTrack,
        audio: audioTrack,
      })

      socketService.login({
        id: user.id,
        fullname: user.fullname,
        imgUrl: user.imgUrl,
        isVideoOn: videoTrack ? true : false,
        isAudioOn: !isMuted || audioTrack ? true : false,
      })
      socketService.joinRoom(roomId)
      if (isRestart) addListeners()
      setErrorBanner('')
    } catch (error) {
      setErrorBanner('Failed to access camera/microphone')
    } finally {
      setIsLoading(false)
    }
  }

  async function toggleMedia(stateToSet: {
    video: boolean
    audio: boolean
  }): Promise<void> {
    try {
      if (!localTracks || !webRTCService || !user || !roomId) return
      setIsLoading(true)
      socketService.leaveRoom(roomId)
      socketService.logout()

      let type = ''
      if (!stateToSet.video) {
        type = 'video'
      } else type = 'audio'

      const stream = await webRTCService.disableLocalStream(type)
      setLocalStream(stream)

      const videoTrack = stream.getVideoTracks()[0] || null
      const audioTrack = stream.getAudioTracks()[0] || null

      setLocalTracks({
        video: videoTrack,
        audio: audioTrack,
      })

      socketService.login({
        id: user.id,
        fullname: user.fullname,
        imgUrl: user.imgUrl,
        isVideoOn: videoTrack ? true : false,
        isAudioOn: stateToSet.audio ? true : false,
      })
      socketService.joinRoom(roomId)
    } catch (error) {
      console.error('Error disabling media:', error)
      setErrorBanner('Failed to disable media')
    } finally {
      setIsLoading(false)
    }
  }

  function clearAllConnections() {
    socket.off(SOCKET_EVENT_MEMBER_CHANGE)
    socket.off(SOCKET_EVENT_OFFER)
    socket.off(SOCKET_EVENT_ANSWER)
    socket.off(SOCKET_EVENT_ICE_CANDIDATE)
    if (webRTCService) {
      webRTCService.closeAllConnections()
    }
    socketService.leaveRoom(roomId)
    connectedPeers.current.clear()
    setRemoteStreams(new Map())
  }

  async function requestPermissions() {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera',
          buttonPositive: 'OK',
        }
      )
      return granted === PermissionsAndroid.RESULTS.GRANTED
    }
    return true
  }

  const copyRoomId = () => {
    if (room?.id) {
      // For React Native, you might need to use a clipboard library
      // For now, we'll show an alert
      Alert.alert('Room ID', `Room ID: ${room.id}`)
    }
  }

  if (!room) {
    return (
      <View style={styles.container}>
        <Text>Loading room...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.navigate('RoomList')}
        >
          <Text style={styles.closeButtonText}>← Back</Text>
        </TouchableOpacity>

        {errorBanner && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorBanner}</Text>
            <TouchableOpacity
              onPress={() => {
                clearAllConnections()
                initializeMedia()
                addListeners()
              }}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView style={styles.videoGrid}>
        {/* Local Video */}
        {localStream && (
          <View style={styles.videoContainer}>
            <RTCView
              streamURL={localStream.toURL()}
              style={styles.video}
              objectFit='cover'
            />
            <View style={styles.videoLabel}>
              <Text style={styles.labelText}>
                You{user?.id === room?.host_id ? ' (Host)' : ''}
              </Text>
            </View>
            <View style={styles.mediaControls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() =>
                  toggleMedia({
                    video: !localTracks.video,
                    audio: localTracks.audio,
                  })
                }
              >
                <Text style={styles.controlText}>
                  {localTracks.video ? '📹' : '🚫'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() =>
                  toggleMedia({
                    video: localTracks.video,
                    audio: !localTracks.audio,
                  })
                }
              >
                <Text style={styles.controlText}>
                  {localTracks.audio ? '🎤' : '🔇'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Remote Videos */}
        {Array.from(remoteStreams.entries()).map(([socketId, stream]) => {
          const member = currMembers.find((m) => m.socketId === socketId)
          return (
            <View key={socketId} style={styles.videoContainer}>
              <RTCView
                streamURL={stream.toURL()}
                style={styles.video}
                objectFit='cover'
              />
              <View style={styles.videoLabel}>
                <Text style={styles.labelText}>
                  {member?.fullname || 'Unknown'}
                  {member?.id === room?.host_id ? ' (Host)' : ''}
                </Text>
              </View>
            </View>
          )
        })}
      </ScrollView>

      <View style={styles.roomInfo}>
        <Text style={styles.roomName}>{room.name}</Text>
        {room.host && (
          <Text style={styles.roomHost}>Host: {room.host.fullname}</Text>
        )}
        <TouchableOpacity style={styles.roomIdContainer} onPress={copyRoomId}>
          <Text style={styles.roomIdLabel}>Room ID: {room.id}</Text>
          <Text style={styles.copyText}>📋</Text>
        </TouchableOpacity>
        <Text style={styles.membersCount}>Members: {currMembers.length}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  errorBanner: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: 'white',
    flex: 1,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  videoGrid: {
    flex: 1,
    padding: 10,
  },
  videoContainer: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  video: {
    width: '100%',
    height: 200,
    backgroundColor: 'black',
  },
  videoLabel: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  labelText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  mediaControls: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
  },
  controlButton: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderRadius: 20,
    marginLeft: 5,
  },
  controlText: {
    fontSize: 16,
  },
  roomInfo: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  roomName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  roomHost: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  roomIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  roomIdLabel: {
    fontSize: 14,
    color: '#333',
  },
  copyText: {
    fontSize: 18,
  },
  membersCount: {
    fontSize: 14,
    color: '#666',
  },
})
