<template>
<div>
<div v-html="questionLinks"></div>
</div>
</template>
<script>
import ItemComponent from "@/router/questions.js";
export default {
  name: "Question",
  beforeRouteUpdate(to, from, next) {
    // URLが変わった時モデルを更新する
    window.scrollTo(0, 0);
    next();
  },
  data() {
    return {
      questionLinks:'',
    };
  },
  methods: {
    makeLinkList() {
      const getLinkObj = (obj) => {
        let seq = obj.name.split("ans").join("")
        return {
          seq,
          title : obj.title,
          link:"#" + obj.path
        }
      }
      let item = ItemComponent
      let result = ''
      for (let i = 0; i < item.length; i+= 20) {
        let tmp = ''
        for (let j = i; j < i + 10; j++) {
          let item1 = getLinkObj(item[j])
          let item2 = getLinkObj(item[j + 10])
          tmp += `<tr>
            <td>Q.${item1.seq} <a href="${item1.link}"> ${item1.title}</a></td>
            <td>Q.${item2.seq} <a href="${item2.link}"> ${item2.title}</a></td>
          </tr>`
        }
        tmp = `<table class="question-table">${tmp}</table>`
        result += `<h3>Q.${i + 1} 〜 Q.${i + 20}</h3>`
        result += tmp
      }
      this.questionLinks = result
    }
  },
  created() {
    this.makeLinkList();
  }
};
</script>
<style>
.question-table {
  width:100%;
  font-size: 12px;
}
tr,td{
  width:500px;
  min-width:49%;
}
</style>