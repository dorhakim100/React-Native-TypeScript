import AsyncStorage from '@react-native-async-storage/async-storage'
import { Prefs } from '../../types/system/Prefs'

const KEY = 'prefs'

export const systemService = {
  getPrefs,
  setPrefs,
}

async function getPrefs(): Promise<Prefs> {
  const entityType = KEY
  let prefs: Prefs
  try {
    const stored = await AsyncStorage.getItem(entityType)

    if (!stored) {
      prefs = { isEnglish: false, isDarkMode: false }
      await setPrefs(prefs)
    } else {
      prefs = JSON.parse(stored) as Prefs
    }
  } catch (error) {
    console.error('Error getting prefs:', error)
    prefs = { isEnglish: false, isDarkMode: false }
    await setPrefs(prefs)
  }

  return prefs
}

async function setPrefs(prefs: Prefs): Promise<void> {
  const entityType = 'prefs'
  try {
    await AsyncStorage.setItem(entityType, JSON.stringify(prefs))
  } catch (e) {
    console.error('Error setting prefs:', e)
  }
}
