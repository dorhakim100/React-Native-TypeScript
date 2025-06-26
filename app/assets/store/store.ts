import { legacy_createStore as createStore, combineReducers } from 'redux'

import { roomReducer } from './reducers/room.reducer'
import { systemReducer } from './reducers/system.reducer'
import { userReducer } from './reducers/user.reducer'

const rootReducer = combineReducers({
  roomModule: roomReducer,
  systemModule: systemReducer,
  userModule: userReducer,
})

export const store = createStore(rootReducer, undefined)

export type RootState = ReturnType<typeof rootReducer>
