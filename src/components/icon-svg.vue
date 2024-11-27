<template>
  <component
    :is="loadSvgIcon(name)"
    class="icon-svg"
    v-bind="$attrs"
  ></component>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    default: ''
  }
})

const svgRecords = import.meta.glob(['../assets/icons/svg/*'], {
  eager: true,
  import: 'default',
  query: '?component'
})

const loadSvgIcon = (name) =>
  svgRecords[`../assets/icons/svg/${name}.svg`] ||
  svgRecords['../assets/icons/svg/icon-0.svg']
</script>

<style>
.icon-svg {
  width: 24px;
  height: 24px;
  font-size: 24px;
  overflow: hidden;
  fill: currentColor;
}
</style>
