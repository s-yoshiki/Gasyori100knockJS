<template>
  <div id="app">
    <header>
      <div class="header-container">
        <h1>
          <a href="#/" class="title" >画像処理100本ノックJS</a>
        </h1>
      </div>
    </header>
    <router-view/>
    <footer>
      <br>
      <ul>
        <li><router-link to="/">ホーム</router-link></li>
        <li><router-link to="/list">問題一覧</router-link></li>
      </ul>
    </footer>
  </div>
</template>

<style>
html {
  /* background-color: #f8f8f8; */
}

/* body {
  background-color: #2c3e50
} */

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  /* background-color:   #fefefe; */
  /* background-color: #f8f8f8; */
}

h1 {
  font-size: 26px;
}

.header-container {
  text-align: center; 
}

canvas {
  background-color: rgba(230, 230, 230, 0.5);
}

header {
  /* height: 180px; */
  /* background-color: #f8f8f8; */
  padding: 10px;
}

.title {
  color: #2c3e50;
}

</style>
