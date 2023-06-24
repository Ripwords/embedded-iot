<script lang="ts" setup>
import { store } from '@/store'
import { getAuth, signOut } from 'firebase/auth'
import { errorHandler, notify } from '@/functions/utility'

const pinia = store()
const logout = () => {
  signOut(getAuth()).then(() => {
    notify(pinia.position, 'Logged out successfully')
    pinia.resetState()
    setTimeout(() => {
      window.location.reload()
    }, 1500)
  }).catch((err) => {
    notify(pinia.position, errorHandler(err.code))
  })
}
</script>

<template>
  <ion-button color="light" expand="block" @click="logout">
    <span>LOGOUT&nbsp;&nbsp;&nbsp;</span>
    <i-ion:log-out-outline />
  </ion-button>
</template>