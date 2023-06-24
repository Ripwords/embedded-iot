<script setup lang="ts">
import { store } from '@/store'
import { getPageName, isDesktop } from '@/functions/utility'

const pinia = store()
const numSensors = ref(0)
const loading = ref(true)

const showMonitors = () => {
  numSensors.value = Object.keys(pinia.data).length
  if (numSensors.value > 0) {
    // Subtract 3 because the first two items are not sensors (retry_value, logging_interval) and 1 is display name
    numSensors.value -= 3
  }
  loading.value = false
}

if (Object.keys(pinia.user).length > 0) {
  showMonitors()
}

const unwatch = watch(() => pinia.data, () => {
  showMonitors()
  unwatch()
})
</script>

<template>
  <Page :title="getPageName()">
    <!-- <Update /> -->
    <LoadingBar :show="loading" />
    <Refresh v-if="!isDesktop()" />
    <!-- Sensor Data -->
    <div v-for="index in numSensors" :key="index">
      <Monitor :index="index - 1" />
    </div>
  </Page>
</template>