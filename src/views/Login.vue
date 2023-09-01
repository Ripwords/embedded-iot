<script lang="ts" setup>
import { store } from '@/store'
import { useRouter } from 'vue-router'
import { errorHandler, notify, signInGoogle } from '@/functions/utility'
import { useMagicKeys } from '@vueuse/core'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const pinia = store()
const router = useRouter()
const email = ref("")
const password = ref("")
const { enter } = useMagicKeys()

const loading = ref(false)

const reset = () => {
  email.value = ""
  password.value = ""
  loading.value = false
}

const signIn = async () => {
  loading.value = true,
    signInWithEmailAndPassword(getAuth(), email.value, password.value)
      .then(async () => {
        // After login, reset the form
        reset()
        // Notify the user
        await notify(pinia.position, 'Login successful')
        // Save the user authentication information in store
        pinia.user = getAuth().currentUser
        router.replace('/menu/home')
      })
      .catch(e => {
        // Reset the form
        reset()
        // Notify the user
        notify(pinia.position, errorHandler(e.code))
        // Reset stored user authentication information
        pinia.user = {}
      })
}

watch(enter, (v) => {
  if (v) {
    if (email.value && password.value) signIn()
  }
})
</script>

<template>
  <ion-page>
    <Title />
    <ion-content :fullscreen="true">
      <LoadingBar :show="loading" />
      <cDiv>
        <ion-card>
          <ion-card-content>
            <img src="/Logo.png" alt="logo" width="100" height="100">
          </ion-card-content>
        </ion-card>
      </cDiv>
      <cDiv>
        <ion-card>
          <ion-card-header>
            <ion-card-title>Login</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="w-[500px]">
              <ion-label position="floating">Email</ion-label>
              <ion-input type="email" v-model="email" placeholder="email@domain.com" />
              <ion-label position="floating">Password</ion-label>
              <ion-input type="password" v-model="password" placeholder="******" />
            </div>
          </ion-card-content>
        </ion-card>
      </cDiv>
      <cDiv>
        <ion-button @click="signIn">Sign In</ion-button>
        <ion-button v-if="pinia.GOOGLE_SIGN_IN" @click="signInGoogle(router)"><i-ion:logo-google />oogle</ion-button>
        <ion-button @click="router.replace('/register')">Sign Up</ion-button>
      </cDiv>
      <cDiv>
        <a @click="router.replace('/forgot-password')">Forgot Password</a>
      </cDiv>
    </ion-content>
  </ion-page>
</template>