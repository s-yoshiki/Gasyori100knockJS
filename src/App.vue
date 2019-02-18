<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

.header-container {
  text-align: center; 
}

canvas {
  background-color: rgba(230, 230, 230, 0.5);
}

header {
  height: 150px;
  background-color: #f8f8f8;
  padding: 10px;
}

.title {
  color: #2c3e50;
}
</style>
