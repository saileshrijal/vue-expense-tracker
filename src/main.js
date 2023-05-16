import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import  './firebase'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUserSecret, faSignOut, faFile, faAdd, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'

library.add(faUserSecret, faSignOut, faFacebook, faFile, faAdd, faArrowLeft)


createApp(App)
.component('font-awesome-icon', FontAwesomeIcon)
.use(router)
.mount('#app')
