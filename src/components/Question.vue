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
    <div class="blog-area">
      <p>
        <button ref="blog-button" v-on:click="blogFrame = !blogFrame">
          埋め込みコード取得
          <span v-if="blogFrame">▲</span>
          <span v-else>▼</span>
        </button>
      </p>
      <div v-if="blogFrame">
        <textarea class="inline-code" v-model="blogFrameUrl"></textarea>
      </div>
      <div v-else></div>
    </div>
    <QuestionList></QuestionList>
  </div>
</template>

<script>
import description from "./questions/description.js";
import QuestionList from "./QuestionList.vue";
export default {
  name: "Question",
  components: {
    QuestionList
  },
  beforeRouteUpdate(to, from, next) {
    // URLが変わった時モデルを更新する
    this.init();
    window.scrollTo(0, 0);
    next();
  },
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
      blogFrame: false,
      blogFrameUrl: ""
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
        let seq = this.screenSeq - 1;
        let title = "";
        let key = "ans" + Number(seq);
        if (description[key]) {
          title = description[key].title;
        }
        this.pageNation.last = `#/questions/ans${seq}`;
        this.pageNation.lastLabel = `Q.${seq} ` + title;
      } else {
        this.pageNation.lastLabel = "";
      }
      if (this.screenSeq < 100) {
        let seq = this.screenSeq + 1;
        let title = "";
        let key = "ans" + Number(seq);
        if (description[key]) {
          title = description[key].title;
        }
        this.pageNation.next = `#/questions/ans${seq}`;
        this.pageNation.nextLabel = `Q.${seq} ` + title;
      } else {
        this.pageNation.nextLabel = "";
      }
      this.blogFrameUrl = `<iframe src="${
        location.href
      }/iframe" style="width:100%;height:300px;"></iframe>`;
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

.msg {
  text-align: left;
}

.blog-area {
  text-align: right;
}

.inline-code {
  width: 100%;
}

canvas {
  min-width: 80px;
  margin:10px;
  max-height:400px;
}
</style>
