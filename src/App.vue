<template>
  <div id="app">
    <router-view :key="$route.fullPath" />
  </div>
</template>
<script>
export default {};
</script>
<style lang="less">
#app {
  width: 100%;
  height: 100%;
}
</style>
