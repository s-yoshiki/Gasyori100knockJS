<template>
  <div>
    <h3>{{"Q" + screenSeq + "." + title}}</h3>
    <div v-html="description"></div>
    <br>
    <div ref="main" class="main">
      <router-view/>
    </div>
    <div>
      <router-link to="/">画像処理100本ノック</router-link>
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
    };
  },
  methods: {
    init: function(seq) {
      if (!seq) {
        let parser = new URL(location.href);
        let tmp = parser.hash.split("/")
        tmp.pop()
        this.screenId = tmp.pop();
        this.screenSeq = Number(this.screenId.split("ans").join(""));
      } else {
        this.screenId = "ans" + seq;
        this.screenSeq = seq;
      }
      if (!(1 <= this.screenSeq && this.screenSeq <= 100)) {
        location.href = "#/list";
      }
      this.makeDescription();
    },
    makeDescription() {
      if (!description[this.screenId]) {
        this.title = "";
        this.description = "";
        return;
      }
      this.title = description[this.screenId].title;
      this.description = description[this.screenId].desc;
    }
  },
  created() {
    this.init();
  }
}
</script>

<style>
h1 {
  color:#ff0000;
  font-size:0px;
}
.box {
  float: left;
  width: 50%;
}

.boxContainer {
  width: 100%;
  overflow: hidden;
  text-align: center;
}

.msg {
  text-align: left;
}

canvas {
  min-width :80px;
  margin:10px;
}
</style>
