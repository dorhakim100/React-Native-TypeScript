import client from './client'

import axios from 'axios'

const endpoint = '/chat'
import { makeId } from '../services/util.service'

const query = (filter, token) =>
  client.get(endpoint, filter, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

const post = (chatOrMessage, token) => {
  const { chatId } = chatOrMessage

  return client.post(
    `${endpoint}${chatId ? `/${chatId}/msg` : ''}`,
    chatOrMessage,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {},
    }
  )
}

const remove = (chatId, token) => {
  return client.remove(`${endpoint}/${chatId}`, {
    data: {},
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
const removeMessage = (ids, token) => {
  const { messageId, chatId } = ids

  return client.remove(`${endpoint}/message/${messageId}`, {
    data: { chatId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

function getChatById(chatId, token) {
  return client.get(
    `${endpoint}/${chatId}`,
    { chatId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
}

function getDefaultFilter() {
  return {
    txt: '',
    chatsIds: [],
    loggedInUser: '',
    pageIdx: 0,
  }
}

function getEmptyChat() {
  return {
    user: '',
    lastMessageTime: Date.now(),
    messages: [
      {
        from: '',
        content: '',
        sentAt: Date.now() - 2,
      },
      {
        from: '',
        content: '',
        sentAt: Date.now(),
      },
    ],
  }
}

async function getMaxPage(filter) {
  const res = client.get(`${endpoint}/maxPage`, filter)
  if (!res.ok) return res

  return res.data
}
async function checkIsChat(users) {
  const res = client.get(`${endpoint}/isChat`, users, {}, false)
  if (!res.ok) return res

  return res.data
}
export const chatService = {
  query,
  getDefaultFilter,
  post,
  getMaxPage,
  checkIsChat,
  getEmptyChat,
  getChatById,
  remove,
  removeMessage,
}
