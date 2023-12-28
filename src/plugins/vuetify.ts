// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      dark: {
        dark: true,
        colors: {
          // background: '#212121',
          // surface: '#C0CA33',
          'my-default-color': '#C0CA33'
        }
      },
      light: {
        dark: false,
        colors: {
          //     background: '#EEE',
          //     surface: '#FFF'
          'my-default-color': '#212121'
        }
      }
    }
  },
}
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
)
