<template>
  <div>
    <br>
    <h3>{{"Q" + screenSeq + "." + title}}</h3>
    <div v-html="description"></div>
    <br>
    <div class="main">
      <router-view/>
    </div>
    <br>
    <div class="boxContainer">
      <div class="box">
        <a v-bind:href="pageNation.last" v-on:click="movePage(-1)">{{pageNation.lastLabel}}&nbsp;</a>
        <!-- <router-link :to="{path:pageNation.last}" >{{pageNation.lastLabel}}&nbsp;</router-link> -->
      </div>
      <div class="box">
        <a v-bind:href="pageNation.next" v-on:click="movePage(1)">{{pageNation.nextLabel}}&nbsp;</a>
        <!-- <router-link v-on:click="movePage()">{{pageNation.nextLabel}}&nbsp;</router-link> -->
      </div>
    </div>
  </div>
</template>

<script>
import description from "./questions/description.js";

export default {
  name: "Question",
  data() {
    return {
      title: "",
      description: "",
      screenId: "",
      screenSeq: "",
      pageNation : {
        next:"",
        nextLabel:"",
        last:"",
        lastLabel:""
      }
    };
  },
  methods: {
    init: function(seq) {
      if (!seq) {
        let parser = new URL(location.href);
        this.screenId = parser.hash.split("/").pop();
        this.screenSeq = Number(this.screenId.split("ans").join(""));
      } else {
        this.screenId  = "ans" + seq
        this.screenSeq  = seq
      }

      this.makePage()

      this.makeDescription()
    },
    movePage: function(e) {
      this.init(e + this.screenSeq)
    },
    makePage: function() {
      if (this.screenSeq > 1) {
        this.pageNation.last = `#/questions/ans${this.screenSeq - 1}`
        this.pageNation.lastLabel = `Q.${this.screenSeq - 1}`
      }

      if (this.screenSeq < 100) {
        this.pageNation.next = `#/questions/ans${this.screenSeq + 1}`
        this.pageNation.nextLabel = `Q.${this.screenSeq + 1}`
      }
    },
    makeDescription() {
      if (!description[this.screenId]) {
        this.title = ""
        this.description = ""
        return
      }
      this.title = description[this.screenId].title;
      this.description = description[this.screenId].desc;
    }
  },
  created() {
    this.init()
    
    // this.makePage(0)

    // this.makeDescription()
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

canvas {
  background-color: rgba(230, 230, 230, 0.5);
}
a {
  color: #5442b9;
  font-size: 22px;
}

header {
  height: 150px;
  margin: 10px;
  padding: 10px;
}

.box{
  float: left;
  width: 50%;
}

.boxContainer{
  width:100%;
  overflow: hidden;
}

/* button {
  position: relative;
  display: inline-block;
  padding: 0.25em 0.5em;
  text-decoration: none;
  color: #FFF;
  background: #5442b9;
  border-bottom: solid 2px #5442b9;
  border-radius: 4px;
  box-shadow: inset 0 2px 0 rgba(255,255,255,0.2), 0 2px 2px rgba(0, 0, 0, 0.19);
  font-weight: bold;
}

button:active {
  border-bottom: solid 2px #5442b9;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.30);
} */
</style>
