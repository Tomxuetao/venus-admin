<template>
  <iframe class="iframe-wrapper" src="http://localhost:9080/venus-fast/druid/sql.html" width="100%" height="100%"></iframe>
</template>

<script>
export default {
  name: 'monitor'
}
</script>

<style scoped lang="scss">
.iframe-wrapper {
  min-height: 780px;
  border: 0;
}
</style>
