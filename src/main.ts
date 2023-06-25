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
  apiKey: "AIzaSyCgWPzyjIapD0NSDfoQD1lSgfd2AJbCQqQ",
  authDomain: "embedded-iot-7ef1f.firebaseapp.com",
  databaseURL: "https://embedded-iot-7ef1f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "embedded-iot-7ef1f",
  storageBucket: "embedded-iot-7ef1f.appspot.com",
  messagingSenderId: "868537231321",
  appId: "1:868537231321:web:4d51a73c0703f61de6dbc8"
};

initializeApp(firebaseConfig)
const pinia = createPinia()

const app = createApp(App).use(IonicVue).use(pinia).use(router)

router.isReady().then(() => {
  app.mount('#app')
})
