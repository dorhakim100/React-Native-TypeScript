export interface Route {
  title: string
  path: 'Home' | 'About' | 'Services' | 'Login' | 'RoomList' | 'SignIn' | 'Room'
  isList: boolean
}
export const routes: Route[] = [
  {
    title: 'Home',
    path: 'Home',
    isList: true,
  },
  {
    title: 'About',
    path: 'About',
    isList: true,
  },
  {
    title: 'Services',
    path: 'Services',
    isList: true,
  },
  {
    title: 'Sign in',
    path: 'Login',
    isList: true,
  },
  {
    title: 'Room List',
    path: 'RoomList',
    isList: true,
  },
  {
    title: 'Room',
    path: 'Room',
    isList: false,
  },
]
