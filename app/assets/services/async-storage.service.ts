import AsyncStorage from '@react-native-async-storage/async-storage'

export const storageService = {
  query,
  get,
  post,
  put,
  remove,
  postMany,
}

async function query(entityType: string, delay: number = 500): Promise<any> {
  try {
    const entities = await AsyncStorage.getItem(entityType)
    return new Promise((resolve) =>
      setTimeout(() => resolve(entities ? JSON.parse(entities) : []), delay)
    )
  } catch (e) {
    console.error('Error querying data:', e)
    return []
  }
}

async function get(entityType: string, entityId: string): Promise<any> {
  const entities = await query(entityType)
  const entity = entities.find((entity: any) => entity._id === entityId)
  if (!entity) {
    throw new Error(
      `Get failed, cannot find entity with id: ${entityId} in: ${entityType}`
    )
  }
  return entity
}

async function post(entityType: string, newEntity: any): Promise<any> {
  newEntity._id = _makeId()
  const entities = await query(entityType)
  entities.push(newEntity)
  await _save(entityType, entities)
  return newEntity
}

async function put(entityType: string, updatedEntity: any): Promise<any> {
  const entities = await query(entityType)
  const idx = entities.findIndex(
    (entity: any) => entity._id === updatedEntity._id
  )
  if (idx < 0) {
    throw new Error(
      `Update failed, cannot find entity with id: ${updatedEntity._id} in: ${entityType}`
    )
  }
  const entityToUpdate = { ...entities[idx], ...updatedEntity }
  entities.splice(idx, 1, entityToUpdate)
  await _save(entityType, entities)
  return entityToUpdate
}

async function remove(entityType: string, entityId: string): Promise<void> {
  const entities = await query(entityType)
  const idx = entities.findIndex((entity: any) => entity._id === entityId)
  if (idx < 0) {
    throw new Error(
      `Remove failed, cannot find entity with id: ${entityId} in: ${entityType}`
    )
  }
  entities.splice(idx, 1)
  await _save(entityType, entities)
}

async function postMany(
  entityType: string,
  newEntities: any[]
): Promise<any[]> {
  const entities = await query(entityType)
  entities.push(...newEntities)
  await _save(entityType, entities)
  return entities
}

// Private functions

async function _save(entityType: string, entities: any[]): Promise<void> {
  try {
    await AsyncStorage.setItem(entityType, JSON.stringify(entities))
  } catch (e) {
    console.error('Error saving data:', e)
  }
}

function _makeId(length: number = 5): string {
  var text = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}
