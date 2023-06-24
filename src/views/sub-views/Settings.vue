<script setup lang="ts">
import { store } from '@/store'
import { useStorage } from '@vueuse/core'
import { getPageName } from '@/functions/utility'
import { getDatabase, set, ref as fb_ref, get, Database, DatabaseReference } from 'firebase/database'

const pinia = store()
const value = useStorage('value', '0')
const sensorTimeoutRetries = useStorage('sensorTimeoutRetries', "3")
const display_name = useStorage('display_name', '')
const seconds = [1, 3, 5, 10, 30]

let db: Database = getDatabase()
let dbRef: DatabaseReference

if (Object.keys(pinia.data).length > 0) {
  value.value = seconds.indexOf(pinia.data.logging_interval).toString()
  sensorTimeoutRetries.value = String(pinia.data.retry_value)
}

watch(value, () => {
  dbRef = fb_ref(db, `${pinia.user.email.replace('.', '')}/logging_interval`)
  set(dbRef, seconds[Number(value.value)])
})

watch(sensorTimeoutRetries, () => {
  dbRef = fb_ref(db, `${pinia.user.email.replace('.', '')}/retry_value`)
  set(dbRef, Number(sensorTimeoutRetries.value))
})

watch(display_name, () => {
  dbRef = fb_ref(db, `${pinia.user.email.replace('.', '')}/display_name`)
  set(dbRef, display_name.value)
})

watch(() => pinia.data, async () => {
  dbRef = fb_ref(db, `${pinia.user.email.replace('.', '')}/logging_interval`)
  const snap = await get(dbRef)
  dbRef = fb_ref(db, `${pinia.user.email.replace('.', '')}/retry_value`)
  const snap2 = await get(dbRef)
  dbRef = fb_ref(db, `${pinia.user.email.replace('.', '')}/display_name`)
  const snap3 = await get(dbRef)
  value.value = seconds.indexOf(snap.val()).toString()
  sensorTimeoutRetries.value = String(snap2.val())
  if (String(snap3.val()) == "") {
    display_name.value = String(pinia.user.email).split('@')[0]
  } else {
    display_name.value = String(snap3.val())
  }
})
</script>

<template>
  <Page :title="getPageName()">
    <cDiv>
      <ion-list class="max-w-[500px] w-[65vw]">
        <ion-item>
          <ion-label>Sensor update interval</ion-label>
          <ion-select v-model="value">
            <ion-select-option value="0">1 second</ion-select-option>
            <ion-select-option value="1">3 seconds</ion-select-option>
            <ion-select-option value="2">5 seconds</ion-select-option>
            <ion-select-option value="3">10 seconds</ion-select-option>
            <ion-select-option value="4">30 seconds</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-label>Sensor Timeout Retries</ion-label>
          <ion-select v-model="sensorTimeoutRetries">
            <ion-select-option value="3">3</ion-select-option>
            <ion-select-option value="5">5</ion-select-option>
            <ion-select-option value="7">7</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-label class="flex items-center">Uptime Format : {{ pinia.uptimeFormat ? 'HH:MM:SS' : 'Compact'
          }}</ion-label>
          <ion-toggle :enable-on-off-labels="true" :checked="pinia.uptimeFormat"
            @ionChange="pinia.uptimeFormat = !pinia.uptimeFormat" />
        </ion-item>
        <ion-item>
          <ion-label class="flex items-center">Display Name :&nbsp;</ion-label>
          <ion-input v-model="display_name" />
        </ion-item>
      </ion-list>
    </cDiv>
  </Page>
</template>