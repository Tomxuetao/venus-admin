<script setup>
defineOptions({
  name: 'common-desc'
})

const data = defineModel({
  type: Object,
  required: true,
  default: () => ({})
})
const descList = defineModel('descList', {
  type: Array,
  required: true,
  default: () => []
})

const computedValue = (key = '', data = {}) => {
  let value
  if (key.includes('.')) {
    const empty = {}
    const keys = key.split('.')
    let tempData = data
    keys.forEach((item) => {
      tempData = tempData[item] || empty
    })
    value = tempData === empty ? '' : tempData
  } else {
    value = data[key] || ''
  }
  return value
}
</script>

<template>
  <div class="common-desc">
    <div class="desc-inner">
      <div
        v-for="(item, index) in descList"
        :key="index"
        :class="['inner-item', 'inner-item-' + item.key]"
      >
        <div class="item-label">{{ `${item.label}：` }}</div>
        <div v-if="!item.slot" class="item-text">
          {{ `${computedValue(item.key, data)}` }}
        </div>
        <div v-else class="item-text">
          <slot
            :name="item.slot"
            :text="`${computedValue(item.key, data)}`"
            :raw-value="computedValue(item.key, data)"
          >
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.common-desc {
  display: grid;

  .desc-inner {
    display: grid;
    grid-gap: var(--base-grid-gap) 0;
    grid-template-columns: repeat(4, 1fr);

    .inner-item {
      display: flex;
      align-items: center;
      font-size: var(--bsee-font-size);
      line-height: var(--base-line-height-lg);

      .item-label {
        white-space: nowrap;
        color: var(--base-label-color);
      }

      .item-text {
        width: 100%;
        color: var(--base-text-color);
      }
    }
  }
}
</style>
