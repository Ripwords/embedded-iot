<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useMagicKeys } from '@vueuse/core'
import { errorHandler, notify } from '@/functions/utility'
import { sendPasswordResetEmail, getAuth } from 'firebase/auth'

const router = useRouter()
const email = ref("")
const loading = ref(false)
const { enter } = useMagicKeys()

const forgotPassword = async () => {
  loading.value = true
  if (email.value) {
    sendPasswordResetEmail(getAuth(), email.value)
      .then(() => {
        notify("top", "Password reset email sent")
      })
      .catch(e => {
        notify("top", errorHandler(e.code))
      })
      .finally(() => {
        loading.value = false
      })
  }
}

watch(enter, (v) => {
  if (v) {
    if (email.value) forgotPassword()
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
            <ion-card-title>Reset Password</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="w-[500px]">
              <ion-label>Email</ion-label>
              <ion-input type="email" v-model="email" placeholder="email@domain.com" />
            </div>
          </ion-card-content>
        </ion-card>
      </cDiv>
      <cDiv>
        <ion-button expand="block" @click="forgotPassword">Reset Password</ion-button>
      </cDiv>
      <cDiv>
        <a @click="router.replace('/login')">Sign In</a>
      </cDiv>
    </ion-content>
  </ion-page>
</template>