import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'

import { RootState } from '../../store/store'

import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons'

export function AppFooter() {
  const navigation = useNavigation()

  const prefs = useSelector(
    (storeState: RootState) => storeState.systemModule.prefs
  )

  const address = 'Address 19'

  const phone = '09-958-0404'
  const email = 'service.kfar@gmail.com'
  const rights = 'All rights reserved, Dor Hakim'

  const links = {
    facebook: 'https://www.facebook.com/moadonsportkfar/?locale=he_IL',
    instagram: 'https://www.instagram.com/moadonsport/',
    whatsapp: 'https://wa.me/972522681757',
  }

  const handleCopyToClipboard = async () => {
    try {
      await Linking.openURL(`mailto:${email}`)
      // In React Native, directly copying to clipboard might not show a toast easily.
      // We can use a simple Alert for feedback.
      Alert.alert('Email', 'Opening email client')
    } catch (err) {
      Alert.alert('Error', `Couldn't open email client`)
    }
  }

  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url)
    if (supported) {
      await Linking.openURL(url)
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`)
    }
  }

  const navigateToAbout = () => {
    // Assuming a route named 'About' or similar exists in your navigation stack
    navigation.navigate('About' as never) // Cast to never to bypass type checking if routes are not defined yet
  }

  const call = () => {
    Linking.openURL(`tel:${phone}`)
  }

  return (
    <View style={[styles.appFooter, prefs.isDarkMode ? styles.darkMode : null]}>
      <View style={styles.contactContainer}>
        <TouchableOpacity
          style={styles.methodContainer}
          onPress={navigateToAbout}
        >
          <MaterialIcons name='place' size={24} color='black' />
          <View style={styles.addressContainer}>
            <Text>{address}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.methodContainer} onPress={call}>
          <MaterialIcons name='local-phone' size={24} color='black' />
          <Text style={prefs.isDarkMode ? styles.darkModeText : null}>
            {phone}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.methodContainer}
          onPress={handleCopyToClipboard}
        >
          <MaterialIcons name='mail' size={24} color='black' />
          <Text style={prefs.isDarkMode ? styles.darkModeText : null}>
            {email}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.linksContainer}>
        <TouchableOpacity
          style={styles.socialContainer}
          onPress={() => openLink(links.facebook)}
        >
          <FontAwesome name='facebook' size={24} color='black' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.socialContainer}
          onPress={() => openLink(links.whatsapp)}
        >
          <FontAwesome name='whatsapp' size={24} color='black' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.socialContainer}
          onPress={() => openLink(links.instagram)}
        >
          <FontAwesome name='instagram' size={24} color='black' />
        </TouchableOpacity>
      </View>

      <Text
        style={[
          styles.rightsText,
          prefs.isDarkMode ? styles.darkModeText : null,
        ]}
      >
        {rights} &copy; {new Date().getFullYear()}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  appFooter: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  darkMode: {
    backgroundColor: '#333',
  },
  darkModeText: {
    color: '#fff',
  },
  contactContainer: {
    marginBottom: 20,
  },
  methodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addressContainer: {
    marginLeft: 10,
  },
  linksContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  socialContainer: {
    marginHorizontal: 10,
    padding: 10,
  },
  rightsText: {
    fontSize: 12,
    color: '#666',
  },
})
