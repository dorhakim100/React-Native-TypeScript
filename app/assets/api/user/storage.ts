import * as SecureStore from 'expo-secure-store'
import { jwtDecode } from 'jwt-decode'
import { setRemembered } from '../../store/actions/user.actios'

const key = 'authToken'

const storeToken = async (authToken) => {
  try {
    await SecureStore.setItemAsync(key, authToken)
  } catch (error) {
    console.log('Error storing the auth token', error)
  }
}

const getToken = async () => {
  try {
    return await SecureStore.getItemAsync(key)
  } catch (error) {
    console.log('Error getting the auth token', error)
  }
}

const setRememberedUser = async () => {
  try {
    const token = await getToken()
    return token ? setRemembered(token) : null
  } catch (error) {
    console.log(error)
  }
}

const getUser = async () => {
  const token = await getToken()

  return token ? jwtDecode(token) : null
}

const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync(key)
  } catch (error) {
    console.log('Error removing the auth token', error)
  }
}

export default { setRememberedUser, getUser, removeToken, storeToken, getToken }
