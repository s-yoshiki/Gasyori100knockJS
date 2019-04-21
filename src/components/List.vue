<template>
  <div>
    <h2>問題一覧</h2>
    <QuestionList></QuestionList>
  </div>
</template>

<script>
import ItemComponent from '@/router/questions.js'
import QuestionList from "./QuestionList.vue";
export default {
  name: 'List',
  components: {
    QuestionList,
  },
  data () {
    return {
      questionLinks : ItemComponent
    }
  },
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
</style>
