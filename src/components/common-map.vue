<script setup>
import { disposeInstance, createMapInstance } from '@/utils/create-map'

const mapInstance = createMapInstance()

onMounted(() => {
  mapInstance.setTarget('map')
})

onUnmounted(() => {
  disposeInstance()
})
</script>

<template>
  <div class="map-container" id="map"></div>
</template>

<style scoped lang="scss">
.map-container {
  width: 100%;
  height: 100%;
}
</style>
