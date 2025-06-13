import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'

import { GameFilter } from '../../types/gameFilter/GameFilter'
import { Game } from '../../types/game/Game'

const STORAGE_KEY = 'game'
const PAGE_SIZE = 6

export const gameService = {
  query,
  getById,
  remove,
  getEmptyGame,
  getDefaultFilter,
  getMaxPage,
}

async function query(
  filterBy: GameFilter = {
    txt: '',
    categories: [],
    sortDir: 0,
    pageIdx: 0,
    isAll: false,
  }
): Promise<any> {
  try {
    var games = await storageService.query(STORAGE_KEY)
    const { txt, sortDir, categories, pageIdx, isAll } = filterBy

    if (isAll) return games

    if (txt) {
      const regex = new RegExp(filterBy.txt, 'i')
      games = games.filter(
        (game: Game) => regex.test(game.title) || regex.test(game.description)
      )
    }

    if (categories.length > 0) {
      games = games.filter((game: Game) =>
        categories.some((type) => game.categories.includes(type))
      )
    }

    if (sortDir) {
      games.sort(
        (game1: Game, game2: Game) =>
          game1.title.localeCompare(game2.title) * sortDir
      )
    }

    if (pageIdx !== undefined) {
      const startIdx = pageIdx * PAGE_SIZE
      games = games.slice(startIdx, startIdx + PAGE_SIZE)
    }

    return games
  } catch (err: Error | any) {
    // // console.log('Had issues, reverting to demo data', err)
    throw err
  }
}

function getById(gameId: string): Promise<any> {
  try {
    return storageService.get(STORAGE_KEY, gameId)
  } catch (error: Error | any) {
    // // console.log('Had issues, reverting to demo data', error)
    throw error
  }
}

async function remove(gameId: string) {
  // throw new Error('Nope')
  try {
    await storageService.remove(STORAGE_KEY, gameId)
  } catch (error: Error | any) {
    // // console.log('Had issues, reverting to demo data', error)
    throw error
  }
}

function getEmptyGame(): Game {
  return {
    _id: makeId(),

    title: '',
    description: '',
    categories: [],
    images: [],
  }
}

function getDefaultFilter(): GameFilter {
  return {
    txt: '',
    sortDir: 1,
    categories: [],
    pageIdx: 0,
    isAll: false,
  }
}

async function getMaxPage(filterBy: GameFilter): Promise<any> {
  try {
    var games = await query({ ...filterBy, isAll: true })
    let maxPage = games.length / PAGE_SIZE
    maxPage = Math.ceil(maxPage)
    return maxPage
  } catch (err) {
    // // console.log(err)
  }
}
