<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <div class="flex justify-between">
          <ion-title>{{ props.title }}</ion-title>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <slot />
    </ion-content>
  </ion-page>
</template>