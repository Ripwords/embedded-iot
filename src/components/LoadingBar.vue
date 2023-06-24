<script lang="ts" setup>
const props = defineProps<{ show: boolean }>()

const loading = computed(() => props.show)
</script>

<template>
  <ion-progress-bar v-if="loading" type="indeterminate" />
</template>