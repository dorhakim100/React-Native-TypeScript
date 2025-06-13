import { DefaultTheme } from '@react-navigation/native'

const NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(255, 45, 85)',
    background: 'rgb(242, 242, 242)',
  },
}

export default NavigationTheme
