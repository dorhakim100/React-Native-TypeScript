export interface Route {
  title: string
  path: 'Home' | 'About' | 'Services' | 'Login' | 'RoomList' | 'SignIn'
}

export const routes: Route[] = [
  {
    title: 'Home',
    path: 'Home',
  },
  {
    title: 'About',
    path: 'About',
  },
  {
    title: 'Services',
    path: 'Services',
  },
  {
    title: 'Sign in',
    path: 'Login',
  },
  {
    title: 'Room List',
    path: 'RoomList',
  },
]
