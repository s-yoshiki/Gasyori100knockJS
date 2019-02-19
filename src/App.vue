<template>
  <div id="app">
    <header>
      <div class="header-container">
        <h1>
          <a href="#/" class="title" >画像処理100本ノックJS</a>
        </h1>
        <router-link to="/list">list</router-link>
      </div>
    </header>
    <router-view/>
    <footer>
    </footer>
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

body {
  /* background-color: #2c3e50 */
}

#app {
  /* background-color:   #fefefe; */
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
