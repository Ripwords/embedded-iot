<script lang="ts" setup>
import { getPageName } from '@/functions/utility'
</script>

<template>
  <Page :title="getPageName()"></Page>
</template>