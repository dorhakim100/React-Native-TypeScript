import { setRemembered } from '../../store/actions/user.actions'
import client from '../client'
import authStorage from './storage'
import { jwtDecode } from 'jwt-decode'

const login = (userCred) => client.post('/auth/login', userCred)

const signup = (userCred) => client.post('/auth/signup', userCred)

const getUsers = (filter) => client.get('/user', filter)
const getById = (userId) => client.get(`/user/${userId}`)
const remove = (userId) => client.remove(`/user/${userId}`)
const update = async (updatedUser, token) => {
  const res = await client.put(`/user/${updatedUser._id}`, updatedUser, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) return res
  await authStorage.storeToken(res.data)

  const user = setRemembered(res.data)

  return user
}

function getLoggedinUser() {
  return null
}

export const userService = {
  login,
  signup,
  getUsers,
  getById,
  remove,
  getLoggedinUser,
  getEmptyUser,
  update,
}

function getEmptyUser() {
  return {
    username: '',
    password: '',
    fullname: '',
    isAdmin: false,
    email: '',
    items: [],
    image: '',
  }
}
