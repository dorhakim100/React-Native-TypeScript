import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'

const prefix = 'cache'
const expiryInMinutes = 5

// const clearAsyncStorage = async () => {
//   try {
//     await AsyncStorage.clear()
//     console.log('AsyncStorage successfully cleared!')
//   } catch (error) {
//     console.error('Error clearing AsyncStorage:', error)
//   }
// }

// // Call this function when you want to clear the cache, e.g., on a button press
// clearAsyncStorage()

const store = async (key: any, value: any) => {
  try {
    const item = {
      value,
      timestamp: Date.now(),
    }
    await AsyncStorage.setItem(prefix + key, JSON.stringify(item))
  } catch (error) {
    console.log(error)
  }
}

const isExpired = (item: any) => {
  const now = moment(Date.now())
  const storedTime = moment(item.timestamp)
  return now.diff(storedTime, 'minutes') > 5
}

const get = async (key: any) => {
  try {
    const value = await AsyncStorage.getItem(prefix + key)
    const item = JSON.parse(value)

    // const item = {}

    if (!item) return null

    if (isExpired(item)) {
      // Command Query Separation (CQS)
      await AsyncStorage.removeItem(prefix + key)
      return null
    }

    if (typeof item !== 'object') return null
    return item.value
  } catch (error) {
    console.log(error)
  }
}

export default {
  store,
  get,
}
