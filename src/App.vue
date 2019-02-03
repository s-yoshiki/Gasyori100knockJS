<template>
  <div id="app">
    <header></header>
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
    <footer></footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

canvas {
  background-color: rgba(230, 230, 230, 0.5);
}
</style>
