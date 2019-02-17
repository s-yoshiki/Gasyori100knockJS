<template>
  <div>
    <br>
    <h3>{{"Q" + screenSeq + "." + title}}</h3>
    <div v-html="description"></div>
    <br>
    <div ref="main" class="main">
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
      pageNation: {
        next: "",
        nextLabel: "",
        last: "",
        lastLabel: ""
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
        this.screenId = "ans" + seq;
        this.screenSeq = seq;
      }
      if (!(1 <= this.screenSeq && this.screenSeq <= 100)) {
        location.href = "#/list";
      }
      this.makePage();
      this.makeDescription();
    },
    movePage: function(e) {
      this.init(e + this.screenSeq);
    },
    makePage: function() {
      if (this.screenSeq > 1) {
        this.pageNation.last = `#/questions/ans${this.screenSeq - 1}`;
        this.pageNation.lastLabel = `Q.${this.screenSeq - 1}`;
      }
      if (this.screenSeq < 100) {
        this.pageNation.next = `#/questions/ans${this.screenSeq + 1}`;
        this.pageNation.nextLabel = `Q.${this.screenSeq + 1}`;
      }
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
};
</script>

<style>
.box {
  float: left;
  width: 50%;
}

.boxContainer {
  width: 100%;
  overflow: hidden;
  text-align: center;
}

.main {
  text-align: center;
}
</style>
