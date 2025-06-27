import client from './client'

import axios from 'axios'

const endpoint = '/room'
import { makeId } from '../services/util.service'
import { RoomFilter } from '../types/roomFilter/RoomFilter'
import { Room } from '../types/room/Room'

const query = (filter: RoomFilter) => client.get<Room[]>(endpoint, filter)

const post = (itemToAdd, onProgress) => {
  // delete itemToAdd._id
  const data = new FormData()

  data.append('label', itemToAdd.label)
  data.append('price', itemToAdd.price)
  data.append('description', itemToAdd.description)

  itemToAdd.categories.forEach((category, index) =>
    data.append('categories', category)
  )

  const stringifyArray = JSON.stringify(itemToAdd.images)

  data.append('images', stringifyArray)

  for (const property in itemToAdd.sellingUser) {
    data.append(`sellingUser[${property}]`, itemToAdd.sellingUser[property])
  }
  for (const property in itemToAdd.location) {
    data.append(`location[${property}]`, itemToAdd.location[property])
  }

  return client.post(`${endpoint}`, data, {
    onUploadProgress: (progress) =>
      onProgress(progress.loaded / progress.total),
  })
}

const getById = (itemId, filter = getDefaultFilter()) =>
  client.get(`${endpoint}/${itemId}`, filter)

const update = (itemId, itemToUpdate, token) => {
  return client.put(`${endpoint}/${itemId}`, itemToUpdate, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const roomService = {
  query,
  getDefaultFilter,
  post,
  update,
  // getMaxPage,
  getEmptyRoom,
  getById,
}
function getDefaultFilter() {
  return {
    txt: '',
    hostId: '',
    pageIdx: 0,
  }
}

function getEmptyRoom() {
  return {
    id: makeId(),
    name: '',
    host_id: '',
    host: { fullname: '' },
    is_private: false,
    max_participants: 10,
    created_at: new Date(),
  }
}

// async function getMaxPage(filter) {
//   const res = client.get(`${endpoint}/maxPage`, filter)
//   if (!res.ok) return res

//   return res.data
// }
