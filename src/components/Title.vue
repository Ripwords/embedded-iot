<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <ion-title class="hover:cursor-pointer" @click="router.replace('/menu/home')">Smart Animal Farm</ion-title>
    </ion-toolbar>
  </ion-header>
</template>