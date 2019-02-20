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
        <a v-bind:href="pageNation.last" v-on:click="movePage()">{{pageNation.lastLabel}}&nbsp;</a>
      </div>
      <div class="box">
        <a v-bind:href="pageNation.next" v-on:click="movePage()">{{pageNation.nextLabel}}&nbsp;</a>
      </div>
    </div>
    <br>
    <hr>
    <br>
    <div>
      <ul v-for="item in questionLinks" :key="item.name">
        <li>
          <span v-if="item.name === screenId">
            Q.{{item.name.split("ans").join("")}} {{item.title}}
          </span>
          <span v-else>
            <router-link :to="{path:item.path}" :click="movePage()">
              Q.{{item.name.split("ans").join("")}} {{item.title}}
            </router-link>
          </span>
          <div v-if="Number(item.name.split('ans').join('')) % 10 === 0">
            <hr>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import description from "./questions/description.js";
import ItemComponent from "@/router/questions.js";
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
      },
      questionLinks: ItemComponent
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
      this.makeDescription();
      this.makePage();
    },
    movePage: function() {
      this.init();
    },
    makePage: function() {
      if (this.screenSeq > 1) {
        let title = ""
        let key = "ans" + Number(this.screenSeq - 1)
        if (description[key]) {
          title = description[key].title
        }
        this.pageNation.last = `#/questions/ans${this.screenSeq - 1}`;
        this.pageNation.lastLabel = `Q.${this.screenSeq - 1} ` + title;
      }
      if (this.screenSeq < 100) {
        let title = ""
        let key = "ans" + Number(this.screenSeq + 1)
        if (description[key]) {
          title = description[key].title
        }
        this.pageNation.next = `#/questions/ans${this.screenSeq + 1}`;
        this.pageNation.nextLabel = `Q.${this.screenSeq + 1} ` + title;
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
