<template>
  <div id="app">
    <header v-if="header">
      <div class="header-container">
        <h1>
          <a href="#/" class="title">画像処理100本ノックJS</a>
        </h1>
      </div>
    </header>
    <header v-else></header>
    <router-view/>
    <footer v-if="footer">
      <br>
      <ul>
        <li>
          <router-link to="/">ホーム</router-link>
        </li>
        <li>
          <router-link to="/list">問題一覧</router-link>
        </li>
      </ul>
    </footer>
    <footer v-else></footer>
  </div>
</template>
<script>
export default {
  name: "App",
  data() {
    return {
      header: true, //header表示フラグ
      footer: true //footer表示フラグ
    };
  },
  methods: {
    iframeInit() {
      if (/questions\/ans([0-9]|[0-9][0-9])\/iframe/.test(location.href)) {
        this.header = false;
        this.footer = false;
      } else {
        this.header = true;
        this.footer = true;
      }
    }
  },
  watch: {
    $route: function(to, from) {
      if (to.path !== from.path) {
        this.iframeInit()
      }
    }
  },
  created() {
    this.iframeInit()
  },
  mounted() {
    this.iframeInit()
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  /* background-color:   #fefefe; */
  /* background-color: #f8f8f8; */
}

h1 {
  font-size: 10px;
}

canvas {
  background-color: rgba(230, 230, 230, 0.5);
}

header {
  padding: 10px;
}

.title {
  color: #2c3e50;
}
</style>
