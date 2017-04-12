<template>
  <div id="app">
    <navigation id="nav"></navigation>
    <router-view></router-view>
  </div>
</template>

<script>
  import Navigation from './components/Navigation.vue'

  export default {
    name: 'app',
    components: {
      Navigation
    }
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
  #nav {
    margin-bottom: 20px;
  }
</style>
