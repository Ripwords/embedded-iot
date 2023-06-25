<script setup lang="ts">
import { store } from '@/store'
import { getPageName, isDesktop } from '@/functions/utility'

const pinia = store()
const loading = ref(true)

const showMonitors = () => {
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
    <Monitor />
  </Page>
</template>