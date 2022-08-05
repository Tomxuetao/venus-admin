<template>
  <svg
      :class="getClassName"
      :width="width"
      :height="height"
      aria-hidden="true">
    <use :xlink:href="getName"></use>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  className: {
    type: String
  },
  width: {
    type: String
  },
  height: {
    type: String
  }
})

const getName = computed(() => {
  return `#icon-${props.name}`
})

const getClassName = computed(() => {
  return [
    'icon-svg',
    `icon-svg__${props.name}`,
    props.className && /\S/.test(props.className) ? `${props.className}` : ''
  ]
})
</script>

<style>
.icon-svg {
  width: 1em;
  height: 1em;
  fill: currentColor;
  overflow: hidden;
}
</style>
