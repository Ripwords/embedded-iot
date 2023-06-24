<script lang="ts" setup>
import { store } from '@/store'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { errorHandler, initDB, notify } from '@/functions/utility'
import { getAuth, getRedirectResult, onAuthStateChanged } from 'firebase/auth'


let auth: any
const route = useRoute()
const router = useRouter()
const pinia = store()
pinia.user = {}

onMounted(() => {
  auth = getAuth()
  if (pinia.GOOGLE_SIGN_IN) {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          router.replace('/menu')
        }
      })
      .catch((error) => {
        notify(pinia.position, errorHandler(error.code))
      })
  }
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      pinia.user = user
      notify(pinia.position, 'Welcome back!')
      // Data Hydration from Realtime Database
      initDB(pinia.user.email, pinia)
    } else {
      pinia.resetState()
    }
  })
})
</script>

<template>
  <ion-app>
    <ReloadPrompt />
    <ion-router-outlet :key="route.fullPath"></ion-router-outlet>
  </ion-app>
</template>

<style>
a:hover {
  cursor: pointer;
}
</style>
