<script lang="ts" setup>
import { store } from '@/store'

const pinia = store()
const numSensors = ref(0)

const getNumSensors = () => {
  numSensors.value = Object.keys(pinia.data).length
  if (numSensors.value > 0) {
    // Subtract 3 because the first two items are not sensors (retry_value, logging_interval) and 1 is display name
    numSensors.value -= 3
  }
}

const uploadHandler = (sensor: number) => {
  // Redirect to localIP/update page in another tab
  if (pinia.data[sensor - 1].localip) {
    window.open(`http://${pinia.data[sensor - 1].localip}/update`, '_blank')
  }
}

const unwatch = watch(() => pinia.data, () => {
  getNumSensors()
  unwatch()
})
</script>

<template>
  <ion-fab v-if="numSensors > 0" slot="fixed" horizontal="end" vertical="bottom">
    <ion-fab-button>
      <i-ion:cloud-upload-outline />
    </ion-fab-button>
    <ion-fab-list side="top">
      <ion-fab-button v-for="sensor in numSensors" :key="sensor" @click="uploadHandler(sensor)">
        {{ sensor }}
      </ion-fab-button>
    </ion-fab-list>
  </ion-fab>
</template>