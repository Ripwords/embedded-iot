<script lang="ts" setup>
import { store } from '@/store'
import { useRouter } from 'vue-router'
import { errorHandler, notify, signInGoogle } from '@/functions/utility'
import { useMagicKeys } from '@vueuse/core'
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'

const pinia = store()
const router = useRouter()
const loading = ref(false)

const email = ref("")
const password = ref("")
const password2 = ref("")
const { enter } = useMagicKeys()

const reset = () => {
  email.value = ""
  password.value = ""
  password2.value = ""
}

const verifyEmail = async (user: any) => {
  await sendEmailVerification(user, {
    url: import.meta.env.PROD ? 'https://hydroponic-monitor.netlify.app/' : 'http://127.0.0.1:5173/'
  })
}

const register = async () => {
  if (email.value == '' || password.value == '' || password2.value == '') {
    notify(pinia.position, 'Please fill in all fields')
  } else if (password.value !== password2.value) {
    notify(pinia.position, 'Passwords do not match')
  } else {
    loading.value = true
    createUserWithEmailAndPassword(getAuth(), email.value, password.value)
      .then(async (creds) => {
        pinia.user = creds.user
        await verifyEmail(creds.user)
        notify(pinia.position, 'Please verify your email')
        router.replace('/menu/home')
      })
      .catch((err) => {
        notify(pinia.position, errorHandler(err.code))
      })
      .finally(() => {
        loading.value = false
        reset()
      })
  }
}

watch(enter, (v) => {
  if (v) {
    if (email.value && password.value) {
      register()
    }
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
          <ion-card-header>
            <ion-card-title>Register</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="w-[500px]">
              <ion-label>Email</ion-label>
              <ion-input type="email" v-model="email" placeholder="email@domain.com" />
              <ion-label>Password</ion-label>
              <ion-input type="password" v-model="password" placeholder="******" />
              <Transition>
                <div v-show="password != ''">
                  <ion-label>Confirm Password</ion-label>
                  <ion-input type="password" v-model="password2" placeholder="******" />
                </div>
              </Transition>
            </div>
          </ion-card-content>
        </ion-card>
      </cDiv>
      <cDiv>
        <ion-button expand="block" @click="register">Register</ion-button>
        <ion-button v-if="pinia.GOOGLE_SIGN_IN" @click="signInGoogle(router)"><i-ion:logo-google />oogle</ion-button>
      </cDiv>
      <cDiv>
        <a @click="router.replace('/login')">Already have an account?</a>
      </cDiv>
    </ion-content>
  </ion-page>
</template>

<style scoped>
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>