<script lang="ts" setup>
const refreshPage = () => {
  window.location.reload()
}
</script>

<template>
  <ion-refresher slot="fixed" id="refresher" @ionRefresh="refreshPage">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>
</template>