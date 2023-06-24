import { createApp } from 'vue'
import { IonicVue } from '@ionic/vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { initializeApp } from 'firebase/app'
import 'virtual:windi.css'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

const firebaseConfig = {
  apiKey: "AIzaSyAOczKFgRE_QjZBmdMDJsyN-vnQFicAvNY",
  authDomain: "hydroponic-monitor.firebaseapp.com",
  projectId: "hydroponic-monitor",
  storageBucket: "hydroponic-monitor.appspot.com",
  messagingSenderId: "464761357054",
  appId: "1:464761357054:web:8ac5fa9c0898076c21dbaf",
  measurementId: "G-LYTQ948YHD",
  databaseURL: "https://hydroponic-monitor-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const application = initializeApp(firebaseConfig)
const pinia = createPinia()

const app = createApp(App).use(IonicVue).use(pinia).use(router)

router.isReady().then(() => {
  app.mount('#app')
})
